
export const dynamic = 'force-dynamic';
// This file is a Server Component by default
import EditRecipeClientPage from './edit-client-page';


export default function EditRecipePageWrapper({ params }: { params: { id: string } }) {
  // This Server Component wrapper renders the actual client-side page component,
  // passing the route parameters (like id) to it.
  return <EditRecipeClientPage params={params} />;
}
