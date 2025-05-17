import React from 'react';
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Code2, Database, GitMerge, LayoutDashboard, Lightbulb, Puzzle, Rocket, Search, CheckCircle, MessageSquare, Globe, ArrowUpRight, BookOpen, GraduationCap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "Project Documentation - Juris.Ai",
  description: "Detailed documentation for the Juris.Ai project, covering architecture, features, and technologies.",
};

const DocsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <header className="text-center mb-16 md:mb-20">
        <div className="inline-block mb-6 bg-primary/10 p-2 rounded-full">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          Juris.Ai Documentation
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Welcome to the official documentation for Juris.Ai. Here you&apos;ll find comprehensive information about the project.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5 border-primary/20">
            <Code2 className="h-3.5 w-3.5 mr-1" />
            Next.js
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5 border-primary/20">
            <Code2 className="h-3.5 w-3.5 mr-1" />
            TypeScript
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5 border-primary/20">
            <Code2 className="h-3.5 w-3.5 mr-1" />
            Tailwind CSS
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5 border-primary/20">
            <Database className="h-3.5 w-3.5 mr-1" />
            Supabase
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5 border-primary/20">
            <Lightbulb className="h-3.5 w-3.5 mr-1" />
            AI Integration
          </Badge>
        </div>
      </header>

      {/* Quick Navigation */}
      <div className="mb-16 md:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="#introduction" scroll>
            <Card className="cursor-pointer h-full hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
              <CardContent className="p-6 flex items-center">
                <Lightbulb className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Introduction</p>
                <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
          <Link href="#technologies" scroll>
            <Card className="cursor-pointer h-full hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
              <CardContent className="p-6 flex items-center">
                <Code2 className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Technologies</p>
                <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
          <Link href="#features" scroll>
            <Card className="cursor-pointer h-full hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
              <CardContent className="p-6 flex items-center">
                <Puzzle className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Features</p>
                <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
          <Link href="#getting-started" scroll>
            <Card className="cursor-pointer h-full hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
              <CardContent className="p-6 flex items-center">
                <Rocket className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Getting Started</p>
                <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Introduction Section */}
      <section id="introduction" className="mb-16 md:mb-20 scroll-mt-20">
        <Card className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <span className="p-2 bg-primary/10 rounded-full">
              <Lightbulb className="h-6 w-6 text-primary" />
            </span>
            <CardTitle className="text-2xl md:text-3xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-5 text-base md:text-lg leading-relaxed pt-4">
            <p>
              Juris.Ai is an innovative platform designed to revolutionize how individuals and legal professionals interact with legal information and services. Our core mission is to democratize access to legal understanding through the power of Artificial Intelligence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5">
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">AI-powered Analysis</h3>
                <p className="text-sm text-muted-foreground">Advanced legal document analysis and interpretation through AI</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Jurisdiction Aware</h3>
                <p className="text-sm text-muted-foreground">Tailored legal advice based on specific jurisdictions</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5">
                <BookText className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Knowledge Base</h3>
                <p className="text-sm text-muted-foreground">Access to a comprehensive database of legal information</p>
              </div>
            </div>
            <p>
              This documentation provides an in-depth look into the project's architecture, the technologies it employs, its key features, and guidelines for contributors or users interested in understanding its inner workings.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Technologies Used Section */}
      <section id="technologies" className="mb-16 md:mb-20 scroll-mt-20">
        <Card className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <span className="p-2 bg-primary/10 rounded-full">
              <Code2 className="h-6 w-6 text-primary" />
            </span>
            <CardTitle className="text-2xl md:text-3xl">Core Technologies</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-base md:text-lg leading-relaxed pt-4">
            <p>Juris.Ai is built using a modern, robust technology stack:</p>
            
            <div className="mt-6">
              <Tabs defaultValue="frontend">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                </TabsList>
                <TabsContent value="frontend" className="p-4 bg-primary/5 rounded-md mt-2">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>Next.js (React framework)</strong>: For server-side rendering and static site generation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>TypeScript</strong>: For type safety and better developer experience
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>Tailwind CSS</strong>: For utility-first styling
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>Shadcn/UI</strong>: For modern UI components
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="backend" className="p-4 bg-primary/5 rounded-md mt-2">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>Next.js API Routes</strong>: For serverless API endpoints
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>TypeScript</strong>: For type-safe backend code
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>AI Integration</strong>: Custom models for legal analysis
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="database" className="p-4 bg-primary/5 rounded-md mt-2">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>Supabase</strong>: PostgreSQL database with real-time capabilities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>Supabase Auth</strong>: For user authentication
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="deployment" className="p-4 bg-primary/5 rounded-md mt-2">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>Vercel</strong>: For deployment and hosting
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <strong>ESLint & Prettier</strong>: For code linting and formatting
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Overview Section */}
      <section id="features" className="mb-16 md:mb-20 scroll-mt-20">
        <Card className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <span className="p-2 bg-primary/10 rounded-full">
              <Puzzle className="h-6 w-6 text-primary" />
            </span>
            <CardTitle className="text-2xl md:text-3xl">Features Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-base md:text-lg leading-relaxed pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex items-start p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="rounded-full bg-primary/10 p-2 mr-4 mt-1">
                  <BookText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Legal Document Analysis</h3>
                  <p className="text-sm">Upload and analyze legal documents for summaries and key clause identification.</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="rounded-full bg-primary/10 p-2 mr-4 mt-1">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI-Powered Legal Advice</h3>
                  <p className="text-sm">Ask legal questions and receive AI-generated advice.</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="rounded-full bg-primary/10 p-2 mr-4 mt-1">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Interactive Chat Interface</h3>
                  <p className="text-sm">Converse with an AI legal assistant to explore legal topics.</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="rounded-full bg-primary/10 p-2 mr-4 mt-1">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personalized Profiles</h3>
                  <p className="text-sm">Save queries, documents, and preferences. Manage API keys for extended functionalities.</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="rounded-full bg-primary/10 p-2 mr-4 mt-1">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Jurisdiction-Specific Advice</h3>
                  <p className="text-sm">Tailor advice based on selected jurisdictions.</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="rounded-full bg-primary/10 p-2 mr-4 mt-1">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Authentication & Security</h3>
                  <p className="text-sm">Secure user login, registration, and data handling.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Project Structure Section */}
      <section className="mb-16 md:mb-20 scroll-mt-20">
        <Card className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <span className="p-2 bg-primary/10 rounded-full">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </span>
            <CardTitle className="text-2xl md:text-3xl">Project Structure</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-base md:text-lg leading-relaxed pt-4">
            <p>The project follows a standard Next.js 13+ App Router structure:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div className="p-4 bg-primary/5 rounded-md">
                <p className="font-mono text-sm mb-2 text-foreground font-medium flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-2 text-primary" />
                  /src/app
                </p>
                <p className="text-sm ml-6">Contains all application routes, layouts, and pages.</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-md">
                <p className="font-mono text-sm mb-2 text-foreground font-medium flex items-center">
                  <GitMerge className="h-4 w-4 mr-2 text-primary" />
                  /src/app/api
                </p>
                <p className="text-sm ml-6">Houses backend API route handlers.</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-md">
                <p className="font-mono text-sm mb-2 text-foreground font-medium flex items-center">
                  <Puzzle className="h-4 w-4 mr-2 text-primary" />
                  /src/components
                </p>
                <p className="text-sm ml-6">Shared UI components used across the application.</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-md">
                <p className="font-mono text-sm mb-2 text-foreground font-medium flex items-center">
                  <Puzzle className="h-4 w-4 mr-2 text-primary" />
                  /src/components/ui
                </p>
                <p className="text-sm ml-6">Reusable primitive UI components (likely from Shadcn/UI).</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-md">
                <p className="font-mono text-sm mb-2 text-foreground font-medium flex items-center">
                  <Code2 className="h-4 w-4 mr-2 text-primary" />
                  /src/lib
                </p>
                <p className="text-sm ml-6">Utility functions, Supabase client, AI service integrations, etc.</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-md">
                <p className="font-mono text-sm mb-2 text-foreground font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2 text-primary" />
                  /supabase
                </p>
                <p className="text-sm ml-6">Database schema and migrations.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Getting Started (Development) Section */}
      <section id="getting-started" className="mb-16 md:mb-20 scroll-mt-20">
        <Card className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <span className="p-2 bg-primary/10 rounded-full">
              <Rocket className="h-6 w-6 text-primary" />
            </span>
            <CardTitle className="text-2xl md:text-3xl">Getting Started (Development)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-base md:text-lg leading-relaxed pt-4">
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 my-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Node.js (v14.6.0 or newer)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>npm or yarn package manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Supabase account (for database and authentication)</span>
                </li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Installation Steps</h3>
            <div className="space-y-6">
              <div className="p-4 border border-border rounded-md relative pl-12">
                <div className="absolute left-4 top-4 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium">1</div>
                <p className="font-medium text-foreground mb-1">Clone the repository</p>
                <pre className="bg-card p-2 rounded text-sm overflow-x-auto">git clone &lt;repository-url&gt;</pre>
              </div>
              
              <div className="p-4 border border-border rounded-md relative pl-12">
                <div className="absolute left-4 top-4 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium">2</div>
                <p className="font-medium text-foreground mb-1">Install dependencies</p>
                <pre className="bg-card p-2 rounded text-sm overflow-x-auto">npm install</pre>
                <p className="text-xs text-muted-foreground mt-1">Or using yarn: <code>yarn install</code></p>
              </div>
              
              <div className="p-4 border border-border rounded-md relative pl-12">
                <div className="absolute left-4 top-4 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium">3</div>
                <p className="font-medium text-foreground mb-1">Configure environment variables</p>
                <p className="text-sm mb-2">Create a <code>.env.local</code> file in the root with the following variables:</p>
                <pre className="bg-card p-2 rounded text-sm overflow-x-auto">
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Add other API keys as needed
                </pre>
              </div>
              
              <div className="p-4 border border-border rounded-md relative pl-12">
                <div className="absolute left-4 top-4 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium">4</div>
                <p className="font-medium text-foreground mb-1">Run the development server</p>
                <pre className="bg-card p-2 rounded text-sm overflow-x-auto">npm run dev</pre>
                <p className="text-sm mt-2">Open <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://localhost:3000</a> in your browser.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Documentation Navigation */}
      <section className="mb-16 md:mb-20">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Button variant="outline" size="lg" className="flex items-center">
            <ArrowUpRight className="h-5 w-5 mr-2" />
            <Link href="#introduction">Back to Top</Link>
          </Button>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="flex-1 md:flex-none">
              <Link href="/chat">Try Juris.Ai Chat</Link>
            </Button>
            <Button variant="default" size="lg" className="flex-1 md:flex-none" asChild>
              <Link href="/about">About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocsPage;
