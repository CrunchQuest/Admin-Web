import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DeleteIcon from '@mui/icons-material/Delete';

function Bookedto() {
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase();
      const dataRef = ref(db, 'booked_to'); // Change to 'booked_to'
      onValue(dataRef, (snapshot) => {
        const items = [];
        snapshot.forEach((uidSnapshot) => {
          const uid = uidSnapshot.key;
          uidSnapshot.forEach((bookedSnapshot) => {
            const id = bookedSnapshot.key;
            const item = {
              id: id,
              uid: uid,
              name: bookedSnapshot.val().name,
              address: bookedSnapshot.val().address,
              assistConfirmation: bookedSnapshot.val().assistConfirmation,
              assistUser: bookedSnapshot.val().assistUser,
              buyerConfirmation: bookedSnapshot.val().buyerConfirmation,
              sellerConfirmation: bookedSnapshot.val().sellerConfirmation,
              status: bookedSnapshot.val().status,
              category: bookedSnapshot.val().category,
              date: bookedSnapshot.val().date,
            };
            items.push(item);
          });
        });
        setData(items);
      }, (error) => {
        console.error('Error fetching data:', error);
      });
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    const db = getDatabase();
    const dataRef = ref(db, `booked_to/${id}`); // Change to 'booked_to'
    remove(dataRef)
      .then(() => {
        // Remove the item from state after successful deletion
        setData(prevData => prevData.filter(item => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
    handleCloseDialog();
  };

  const handleOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
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
                        All BookedTo
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <Table>
                        <TableRow>
                          <TableCell>No.</TableCell>
                          <TableCell>User ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Address</TableCell>
                          <TableCell>Assist Confirmation</TableCell>
                          <TableCell>Assist User</TableCell>
                          <TableCell>Buyer Confirmation</TableCell>
                          <TableCell>Seller Confirmation</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      <TableBody>
                        {data.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell>{item.assistConfirmation}</TableCell>
                            <TableCell>{item.assistUser}</TableCell>
                            <TableCell>{item.buyerConfirmation}</TableCell>
                            <TableCell>{item.sellerConfirmation}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>
                              <MDButton
                                onClick={() => handleOpenDialog(item.id)}
                                variant="contained"
                                sx={{
                                  backgroundColor: 'red',
                                  width: '40px',
                                  height: '40px',
                                  minWidth: 'auto',
                                  padding: '5px'
                                }}
                              >
                                <DeleteIcon />
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
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDelete(deleteId)} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Bookedto;
