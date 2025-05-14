"use client";
import { ShoppingListComponent } from "@/components/ShoppingListComponent";
import { Header } from "@/components/navigation/Header";

export default function ShoppingListPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Shopping List" />
      <main className="flex-1 p-4 md:p-6">
        <ShoppingListComponent />
      </main>
    </div>
  );
}
