import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { database } from "../../firebase";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

function UserPerformance() {
  const [performanceData, setPerformanceData] = useState([]);
  const [deletePerformanceId, setDeletePerformanceId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAllPerformances = () => {
      const db = getDatabase();
      const performanceRef = ref(db, 'user_performance');
      onValue(performanceRef, (snapshot) => {
        const performances = [];
        snapshot.forEach((childSnapshot) => {
          const performance = {
            id: childSnapshot.key,
            category_name: childSnapshot.val().category_name,
            rating: childSnapshot.val().rating,
            total: childSnapshot.val().total,
          };
          performances.push(performance);
        });
        setPerformanceData(performances);
      }, (error) => {
        console.error('Error fetching performances:', error);
      });
    };

    fetchAllPerformances();
  }, []);

  const handleDeletePerformance = (performanceId) => {
    const db = getDatabase();
    const performanceRef = ref(db, `user_performance/${performanceId}`);
    remove(performanceRef)
      .then(() => {
        // Remove the performance from state after successful deletion
        setPerformanceData(prevPerformances => prevPerformances.filter(performance => performance.id !== performanceId));
      })
      .catch((error) => {
        console.error('Error deleting performance:', error);
      });
    handleCloseDialog();
  };

  const handleOpenDialog = (performanceId) => {
    setDeletePerformanceId(performanceId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeletePerformanceId(null);
  };

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
                        User Performance
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <Table display="flex" alignItems="center">
                        <TableRow align="center">
                          <TableCell>No.</TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell>Category Name</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Action</TableCell> {/* Add Action column */}
                        </TableRow>
                      <TableBody alignItems="center">
                        {performanceData.map((performance, index) => (
                          <TableRow key={performance.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{performance.id}</TableCell>
                            <TableCell>{performance.categoryName}</TableCell>
                            <TableCell>{performance.rating}</TableCell>
                            <TableCell>{performance.total}</TableCell>
                            <TableCell>
                              <MDButton
                                onClick={() => handleOpenDialog(performance.id)}
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
            Are you sure you want to delete this performance data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeletePerformance(deletePerformanceId)} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserPerformance;
