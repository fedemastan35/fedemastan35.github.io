// This file is a Server Component by default
import EditRecipeClientPage from './edit-client-page';

// Required for `output: "export"` when using dynamic segments
export async function generateStaticParams() {
  // Since recipes are stored in localStorage and not available at build time,
  // we return an empty array. These pages will be client-side rendered on demand.
  return [];
}

export default function EditRecipePageWrapper({ params }: { params: { id: string } }) {
  // This Server Component wrapper renders the actual client-side page component,
  // passing the route parameters (like id) to it.
  return <EditRecipeClientPage params={params} />;
}
