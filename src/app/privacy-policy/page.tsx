import React from 'react';
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Info, Users, Cookie, Edit3, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Juris.Ai",
  description: "Understand how Juris.Ai collects, uses, and protects your personal information.",
};

const PrivacyPolicyPage = () => {
  const policySections = [
    {
      icon: <Info className="h-6 w-6 text-primary" />,
      title: "Information We Collect",
      content: [
        "We may collect personal information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, fill out a form, and in connection with other activities, services, features or resources we make available on our Service.",
        {
          type: "list",
          items: [
            "<strong>Personal Identification Information:</strong> Name, email address, etc., when voluntarily provided.",
            "<strong>Usage Data:</strong> Information on how the Service is accessed and used (e.g., IP address, browser type, pages visited, time spent on pages).",
            "<strong>Uploaded Documents:</strong> Legal documents or other files you upload for analysis. We treat these with strict confidentiality.",
            "<strong>Queries:</strong> Legal questions or prompts you submit to our AI.",
          ],
        },
      ],
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "How We Use Your Information",
      content: [
        "Juris.Ai uses the collected information for various purposes:",
        {
          type: "list",
          items: [
            "To provide and maintain our Service.",
            "To notify you about changes to our Service.",
            "To allow you to participate in interactive features of our Service when you choose to do so.",
            "To provide customer support.",
            "To gather analysis or valuable information so that we can improve our Service.",
            "To monitor the usage of our Service.",
            "To detect, prevent and address technical issues.",
            "To process your uploaded documents and queries to provide AI-powered legal insights.",
          ],
        },
      ],
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Data Security",
      content: [
        "The security of your data is important to us. We strive to use commercially acceptable means to protect your Personal Information, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.",
        "Uploaded documents and sensitive data are encrypted in transit and at rest where feasible.",
      ],
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-primary" />,
      title: "Data Retention",
      content: [
        "We will retain your Personal Information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.",
        "You can request deletion of your account and associated data, subject to legal and operational requirements.",
      ],
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Sharing Your Information",
      content: [
        "We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.",
        "We may use third-party service providers to help us operate our business and the Service or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.",
      ],
    },
    {
      icon: <Cookie className="h-6 w-6 text-primary" />,
      title: "Cookies and Tracking Technologies",
      content: [
        "We use cookies and similar tracking technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. This section explains what cookies we use, why we use them, and how you can control them.",
        {
          type: "list",
          items: [
            "<strong>Strictly Necessary Cookies:</strong> Essential for website functionality, including session management, authentication, and security features. These cannot be disabled.",
            "<strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information about page views, user behavior, and site performance.",
            "<strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns across different platforms.",
            "<strong>Preference Cookies:</strong> Remember your settings and preferences to provide a more personalized experience, such as theme selection and language preferences.",
          ],
        },
        "We implement industry-standard security measures for all cookies, including HttpOnly and Secure flags where appropriate, and SameSite attributes to prevent cross-site request forgery attacks.",
        "You can manage your cookie preferences at any time using our cookie settings panel, accessible via the cookie icon in the bottom-left corner of the website. You can also control cookies through your browser settings, though this may affect website functionality.",
        "For more detailed information about specific cookies we use, their purposes, and retention periods, please refer to our Cookie Policy available through the cookie preferences panel.",
      ],
    },
    {
      icon: <Edit3 className="h-6 w-6 text-primary" />,
      title: "Your Rights",
      content: [
        "You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Information directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.",
      ],
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-primary" />,
      title: "Changes to This Privacy Policy",
      content: [
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
        "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <header className="text-center mb-16 md:mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your privacy is important to us. This policy outlines how we collect, use, protect, and handle your personal information.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: May 17, 2025</p>
      </header>

      <div className="space-y-10 md:space-y-12">
        {policySections.map((section) => (
          <Card key={section.title} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl border bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <span className="p-3 bg-primary/10 rounded-full">
                {section.icon}
              </span>
              <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-base leading-relaxed pl-16 pr-6 pb-6">
              {section.content.map((item, index) => {
                if (typeof item === "string") {
                  return <p key={index} dangerouslySetInnerHTML={{ __html: item }} />;
                }
                if (item.type === "list") {
                  return (
                    <ul key={index} className="list-disc list-outside space-y-2 pl-5">
                      {item.items.map((listItem, listItemIndex) => (
                        <li key={listItemIndex} dangerouslySetInnerHTML={{ __html: listItem }} />
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </CardContent>
          </Card>
        ))}

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl border bg-card/70 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <span className="p-3 bg-primary/10 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </span>
            <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed pl-16 pr-6 pb-6">
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p>
              By email: <a href="mailto:ititsaddy7@gmail.com" className="text-primary hover:underline font-medium">ititsaddy7@gmail.com</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
