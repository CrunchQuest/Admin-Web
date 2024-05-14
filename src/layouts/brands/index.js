import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from "../../firebase";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import MDSnackbar from "../../components/MDSnackbar";
import { Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";


function Brands() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchAllUsers = () => {
      const db = getDatabase();
      const usersRef = ref(db, 'users');
      onValue(usersRef, (snapshot) => {
        const users = [];
        snapshot.forEach((childSnapshot) => {
          const user = {
            id: childSnapshot.key,
            emailAddress: childSnapshot.val().emailAddress,
            verifiedClient: childSnapshot.val().verifiedClient,
            verifiedServiceProvider: childSnapshot.val().verifiedServiceProvider,
          };
          users.push(user);
        });
        setUserData(users);
      }, (error) => {
        console.error('Error fetching users:', error);
      });
    };

    fetchAllUsers();

  }, []);

  return (
<>
  <DashboardLayout>
    <DashboardNavbar />
    <MDBox py={3}>
      <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox pt={2} pb={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium" color="white">
                    All Users
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <Table display="flex" alignItems="center">
                    <TableRow alignItems="center">
                      <TableCell>No.</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Email Address</TableCell>
                      <TableCell>Verified Client</TableCell>
                      <TableCell>Verified Service Provider</TableCell>
                    </TableRow>
                  <TableBody alignItems="center">
                    {userData.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.emailAddress}</TableCell>
                        <TableCell>{user.verifiedClient ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{user.verifiedServiceProvider ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
    <Footer />
  </DashboardLayout>
</>

  );
}

export default Brands;
