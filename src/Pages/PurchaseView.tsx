import { useLocation, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { supabase } from '../supabaseClient';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
interface InvoiceShort { code: number; ref?: string; cost?: number; }
interface Purchase {
  code: number;
  job_id: number;
  by_id: number;
  project_id: number;
  cost: number;
  ref: string;
  contact: string;
  create_at: Date;
  updated_at: Date;
  due_at: Date
  invoice?: InvoiceShort[]
}
export interface Option {
  value: string;
  label: string;
}

interface Job {
  code: number;
  job_category_id: number;
  name: string;
  description: string;
}
const PrintHideBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px', // Or your preferred gap value
  marginTop: '64px', // Or your preferred margin-top value
  '@media print': {
    display: 'none',
  },
}));
function PurchaseView() {
  const [jobDetails, setJobDetails] = useState<Job>({
    code: 0,
    job_category_id: 0,
    name: "",
    description: "",
  });
  const location = useLocation();
  const { purchase } = location.state as { purchase: Purchase };
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const dueDate = new Date(purchase.due_at);
  const createDate = new Date(purchase.create_at);
  const handleEmail = () => {
    // ... (Your email logic)
  };

  const fetchJobs = async () => {
      try {
        const { data, error } = await supabase.from("job").select("*").eq("code", purchase.job_id);
        if (error) throw error;
  
        // Transform data into { value, label } format
        const transformedData = data.map((item) => ({
          code: item.code,
          job_category_id: item.job_category_id,
          name: item.name,
          description: item.description,
        }));
  
        console.log("Fetched job details:", transformedData);
  
        // Update the state with fetched categories
        setJobDetails(transformedData[0]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  useEffect(() => {
    fetchJobs();
    }, []);

  return (
    <Box sx={{ p: 4, bgcolor: '#f0f0f0' }}> {/* Main container */}
      <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
        PURCHASE ORDER
      </Typography>
      <Paper elevation={3} sx={{ p: 8, bgcolor: 'white' }}> {/* Invoice container */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="body2">Green Real Pty Ltd</Typography>
            <Typography variant="body2">ABN: 344 555 3445</Typography>
            <Typography variant="body2">level 3 109 Gladstone St</Typography>
            <Typography variant="body2">Kogarah NSW 2217</Typography>
            <Typography variant="body2">Phone: (02) 9555-5588</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body1">Purchase #: {purchase.code}</Typography>
            <Typography variant="body1">Create Date: {createDate.toLocaleDateString()}</Typography> {/* Handle potential undefined */}
            <Typography variant="body1">Order Expiry Date: {dueDate ? new Date(dueDate).toLocaleDateString() : ''}</Typography> {/* Handle potential undefined */}
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Unit Cost (Including GST)</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Map over your purchase items here */}
              <TableRow>
                <TableCell>{purchase.project_id}</TableCell>
                <TableCell>Job:{jobDetails.name}, {jobDetails.description}, Ref:{purchase.ref}</TableCell>
                <TableCell align="right">{purchase.cost}</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">{purchase.cost}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={4} textAlign="right">
          <Typography variant="body1">GST: ${purchase.cost/10}</Typography>
          <Typography variant="body1" fontWeight="bold">
            Together with GST: ${purchase.cost}
          </Typography>
        </Box>

        <Box mt={8} borderTop={1} borderColor="gray" pt={4} textAlign="center">
          <Typography variant="body1">TERMS</Typography>
          <Typography variant="body1">Please Assure the Highest Quality!</Typography>
        </Box>

        <PrintHideBox>
          <Button variant="contained" onClick={handlePrint}>
            Print
          </Button>
          <Button variant="contained" onClick={handleEmail}>
            Email
          </Button>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </PrintHideBox>
      </Paper>
    </Box>
  );
}


export default PurchaseView;