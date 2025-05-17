import React from 'react';

const AboutHeader = () => {
  return (
    <header className="text-center mb-16 md:mb-20">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
        About Juris.Ai
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        Juris.Ai is dedicated to revolutionizing the legal landscape by providing accessible, intelligent, and user-friendly AI-powered legal tools.
      </p>
    </header>
  );
};

export default AboutHeader;
