// navigationService.ts
import { useNavigate } from 'react-router-dom';
import { Purchase, Invoice, Pay } from '../models';// Assuming your Purchase interface is in types.ts
import { supabase } from '../supabaseClient';

type ProjectData = {
  name: string;
  invoiced: number;
  paid: number;
};

type SupabaseResponseItem = {
  project: { project_name: string }[] | { project_name: string } | null;
  cost: number | null;
  pay: { amount: number }[] | { amount: number } | null;
};

export const getProjectData = async (): Promise<ProjectData[]> => {
  const { data, error } = await supabase
    .from("jobby")
    .select(`
      project!inner(project_name),
      cost,
      pay(amount)
    `);

  if (error) {
    console.error("Error fetching project data:", error);
    return [];
  }

  // Define a type for the accumulator object
  const groupedData: Record<string, ProjectData> = (data as SupabaseResponseItem[]).reduce((acc, item) => {
    // Extract project name from the first element if it's an array
    const projectName = Array.isArray(item.project) 
      ? item.project[0]?.project_name 
      : item.project?.project_name;
    
    if (!projectName) return acc; // Skip if project name is missing

    if (!acc[projectName]) {
      acc[projectName] = { name: projectName, invoiced: 0, paid: 0 };
    }

    // Handle cost
    acc[projectName].invoiced += item.cost ?? 0;

    // Handle pay amount
    const payAmount = Array.isArray(item.pay) 
      ? item.pay.reduce((sum, payItem) => sum + (payItem.amount ?? 0), 0)
      : item.pay?.amount ?? 0;

    acc[projectName].paid += payAmount;

    return acc;
  }, {} as Record<string, ProjectData>);

  return Object.values(groupedData);
};



// export const getJobDataByProject = async (projectId: number) => {
//   const { data, error } = await supabase
//     .from("jobby")
//     .select("job_id, jobs(name), invoiced, paid") // Join with jobs table
//     .eq("project_id", projectId);

//   if (error) {
//     console.error(`Error fetching jobs for project ${projectId}:`, error);
//     return [];
//   }

//   return data.map((item) => ({
//     name: item.jobs?.name, // Get job name from related table
//     invoiced: item.invoiced,
//     paid: item.paid,
//   }));
// };

// export const getPayeeData = async () => {
//   const { data, error } = await supabase
//     .from("jobby")
//     .select("by_id, payees(name), invoiced, paid") // Join with payees table
//     .order("by_id", { ascending: true });

//   if (error) {
//     console.error("Error fetching payee data:", error);
//     return [];
//   }

//   return data.map((item) => ({
//     name: item.payees?.name, // Get payee name from related table
//     invoiced: item.invoiced,
//     paid: item.paid,
//   }));
// };


export const useNavigationService = () => {
  const navigate = useNavigate();

  const handleViewPurchase = (purchase: Purchase) => {
    navigate(`/purchase/${purchase.code}`, { state: { purchase } });
  };
  const handleViewInvoice = (invoice: Invoice) => {
    console.log("invoice passed:",invoice);
    navigate(`/invoice/${invoice.code}`, { state: { invoice } });
  };

  const handleViewPay = (pay: Pay) => {
    console.log(pay);
    navigate(`/pay/${pay.code}`, { state: { pay } });
  };
  return {
    handleViewPurchase,
    handleViewInvoice,
    handleViewPay
  };
};

