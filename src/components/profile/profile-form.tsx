'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import supabase from '@/lib/supabase';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import { MapPin, User, Phone, Mail, Calendar, FileText } from 'lucide-react';

interface ProfileData {
  id?: string;
  name: string;
  // Email is stored in auth.users but not in profiles table
  email: string; // Keep this for UI display only
  phone: string;
  country: string;
  state: string;
  pincode: string;
  // Fields below are not in the actual database
  // bio?: string; 
  // address?: string;
  // avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
  { value: 'other', label: 'Other' },
];

// State/Province options by country
const statesByCountry = {
  us: [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'DC', label: 'District of Columbia' }
  ],
  ca: [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'QC', label: 'Quebec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' }
  ],
  uk: [
    { value: 'England', label: 'England' },
    { value: 'Scotland', label: 'Scotland' },
    { value: 'Wales', label: 'Wales' },
    { value: 'Northern Ireland', label: 'Northern Ireland' }
  ],
  au: [
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NSW', label: 'New South Wales' },
    { value: 'NT', label: 'Northern Territory' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'WA', label: 'Western Australia' }
  ],
  in: [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'DN', label: 'Dadra and Nagar Haveli' },
    { value: 'DD', label: 'Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'LA', label: 'Ladakh' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PY', label: 'Puducherry' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UT', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' }
  ]
};

export function ProfileForm() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshSession } = useAuth();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Set email from user data
        setProfile(prev => ({ ...prev, email: user.email || '' }));
        
        // Get profile data if it exists - Using a different query approach
        console.log('Fetching profile for user:', user.id);
        
        // Try with filter() approach instead of eq()
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .filter('id', 'eq', user.id)
          .maybeSingle(); // Use maybeSingle() instead of single() to avoid PGRST116
        
        console.log('Profile fetch response:', { profileData, profileError });
        
        if (profileError) {
          // If no profile found (PGRST116), we'll handle it by using default values
          if (profileError.code === 'PGRST116') {
            console.log('No profile found for user - will be created when form is submitted');
            // Set default values
            setProfile(prev => ({
              ...prev,
              id: user.id,
              name: user.user_metadata?.name || '',
              email: user.email || '',
              // Keep other fields' default empty values
            }));
          } else if (profileError.code === '401' || profileError.code === '403' || profileError.status === 406) {
            // Auth errors - try refreshing session
            console.log('Auth error detected, refreshing session...');
            await refreshSession();
            
            // Try again with fresh session
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .filter('id', 'eq', user.id)
              .maybeSingle();
            
            if (retryError) {
              if (retryError.code === 'PGRST116') {
                console.log('No profile found after refresh - will be created when form is submitted');
              } else {
                console.error('Error fetching profile after refresh:', retryError);
                setMessage({ type: 'error', text: 'Failed to load profile data' });
              }
            } else if (retryData) {
              // Use the retry data - only fields that exist in the database
              // Email from auth.user, not from profiles
              setProfile({
                id: retryData.id,
                name: retryData.name || '',
                email: user.email || '', // Email from auth, not profiles
                phone: retryData.phone || '',
                country: retryData.country || '',
                state: retryData.state || '',
                pincode: retryData.pincode || '',
                created_at: retryData.created_at,
                updated_at: retryData.updated_at
              });
            }
          } else {
            console.error('Unexpected error fetching profile:', profileError);
            setMessage({ type: 'error', text: 'Failed to load profile data' });
          }
        } else if (profileData) {
          // Profile found successfully - only set fields that exist in the database
          // Email is from auth.user, not from the profiles table
          setProfile({
            id: profileData.id,
            name: profileData.name || '',
            email: user.email || '', // Email from auth, not profiles
            phone: profileData.phone || '',
            country: profileData.country || '',
            state: profileData.state || '',
            pincode: profileData.pincode || '',
            created_at: profileData.created_at,
            updated_at: profileData.updated_at
          });
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setMessage({ type: 'error', text: 'An unexpected error occurred' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const validateProfile = () => {
    if (!profile.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return false;
    }
    
    // Validate phone number (basic validation)
    if (profile.phone && !/^[+\d\s()-]{7,15}$/.test(profile.phone)) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number' });
      return false;
    }
    
    // Validate pincode (basic validation)
    if (profile.pincode && !/^[0-9]{5,10}$/.test(profile.pincode)) {
      setMessage({ type: 'error', text: 'Please enter a valid pincode/zip code (5-10 digits)' });
      return false;
    }
    
    return true;
  };

  // Handle country change - reset state when country changes
  const handleCountryChange = (value: string) => {
    setProfile(prev => ({ ...prev, country: value, state: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to update your profile' });
      setLoading(false);
      return;
    }

    if (!validateProfile()) {
      setLoading(false);
      return;
    }

    try {
      // Only include fields that exist in the database
      const profileData = {
        id: user.id,
        name: profile.name,
        // email field doesn't exist in database
        // email: user.email || '',
        phone: profile.phone,
        country: profile.country,
        state: profile.state,
        pincode: profile.pincode,
        updated_at: new Date().toISOString()
      };

      console.log('Saving profile data:', profileData);

      // Try upsert with simplified approach
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh session/user data
      await refreshSession();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (authLoading || (loading && !profile.email)) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading Profile</CardTitle>
          <CardDescription>Please wait while we load your profile information</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  // Show message if not authenticated
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Not Authenticated</CardTitle>
          <CardDescription>You must be logged in to view your profile</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`p-3 rounded text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {message.text}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="w-16 h-16 border">
            {/* Disable avatar image until avatar_url column is added to database */}
            {/* {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.name} />
            ) : null} */}
            <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{profile.name || 'Your Profile'}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> 
              {profile.email}
            </CardDescription>
            {profile.created_at && (
              <CardDescription className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" /> 
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="personal" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="location">Location & Address</TabsTrigger>
          </TabsList>
        </div>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <TabsContent value="personal" className="space-y-4 mt-0">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                  <User className="h-4 w-4" /> Full Name
                </label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Phone Number
                </label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-4 mt-0">
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Country
                </label>
                <Select 
                  value={profile.country || ''} 
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">State/Province</label>
                {profile.country && statesByCountry[profile.country as keyof typeof statesByCountry] ? (
                  <Select 
                    value={profile.state || ''} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state/province" />
                    </SelectTrigger>
                    <SelectContent>
                      {statesByCountry[profile.country as keyof typeof statesByCountry].map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="state"
                    placeholder="State or Province"
                    value={profile.state}
                    onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm font-medium">Zip/Postal Code</label>
                <Input
                  id="pincode"
                  placeholder="Zip or Postal Code"
                  value={profile.pincode}
                  onChange={(e) => setProfile(prev => ({ ...prev, pincode: e.target.value }))}
                />
              </div>
            </TabsContent>
            
            {message && (
              <div className={`p-3 mt-4 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-5">
            <Button type="button" variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  );
} 