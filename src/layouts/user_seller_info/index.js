import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { database } from "../../firebase";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDSnackbar from "../../components/MDSnackbar";
import { Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

function Info() {
  const [sellerData, setSellerData] = useState([]);
  const [deleteSellerId, setDeleteSellerId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAllSellers = () => {
      const db = getDatabase();
      const sellersRef = ref(db, 'user_seller_info');
      onValue(sellersRef, (snapshot) => {
        const sellers = [];
        snapshot.forEach((childSnapshot) => {
          const seller = {
            id: childSnapshot.key,
            count: childSnapshot.val().count,
            description: childSnapshot.val().description,
            educationalAttainment: childSnapshot.val().educationalAttainment,
            previousSchool: childSnapshot.val().previousSchool,
            totalJobsFinished: childSnapshot.val().totalJobsFinished,
            totalRating: childSnapshot.val().totalRating,
          };
          sellers.push(seller);
        });
        setSellerData(sellers);
      }, (error) => {
        console.error('Error fetching sellers:', error);
      });
    };

    fetchAllSellers();
  }, []);

  const handleDeleteSeller = (sellerId) => {
    const db = getDatabase();
    const sellerRef = ref(db, `user_seller_info/${sellerId}`);
    remove(sellerRef)
      .then(() => {
        // Remove the seller from state after successful deletion
        setSellerData(prevSellers => prevSellers.filter(seller => seller.id !== sellerId));
      })
      .catch((error) => {
        console.error('Error deleting seller:', error);
      });
    handleCloseDialog();
  };

  const handleOpenDialog = (sellerId) => {
    setDeleteSellerId(sellerId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteSellerId(null);
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={30}>
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
                        All Sellers
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <Table display="flex" alignItems="center">
                        <TableRow align="center">
                          <TableCell>No.</TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell>Count</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Educational Attainment</TableCell>
                          <TableCell>Previous School</TableCell>
                          <TableCell>Total Jobs Finished</TableCell>
                          <TableCell>Total Rating</TableCell>
                          <TableCell>Action</TableCell> {/* Add Action column */}
                        </TableRow>
                      <TableBody alignItems="center">
                        {sellerData.map((seller, index) => (
                          <TableRow key={seller.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{seller.id}</TableCell>
                            <TableCell>{seller.count}</TableCell>
                            <TableCell>{seller.description}</TableCell>
                            <TableCell>{seller.educationalAttainment}</TableCell>
                            <TableCell>{seller.previousSchool}</TableCell>
                            <TableCell>{seller.totalJobsFinished}</TableCell>
                            <TableCell>{seller.totalRating}</TableCell>
                            <TableCell>
                              <MDButton
                                onClick={() => handleOpenDialog(seller.id)}
                                variant="outlined"
                                color="error"
                              >
                                Delete
                              </MDButton>
                            </TableCell>
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this seller?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeleteSeller(deleteSellerId)} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Info;
