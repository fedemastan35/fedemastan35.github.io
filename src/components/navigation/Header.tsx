"use client";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 mb-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
