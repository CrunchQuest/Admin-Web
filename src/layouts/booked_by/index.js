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

function Review() {
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase();
      const dataRef = ref(db, 'reviews'); // Replace 'reviews' with the correct path in your database
      onValue(dataRef, (snapshot) => {
        const items = [];
        snapshot.forEach((childSnapshot) => {
          const id = childSnapshot.key;
          childSnapshot.forEach((uidSnapshot) => {
            const item = {
              id: id,
              uid: uidSnapshot.key,
              categoryId: uidSnapshot.val().categoryId,
              rating: uidSnapshot.val().rating,
              review: uidSnapshot.val().review,
              userUid: uidSnapshot.val().userUid,
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
    const dataRef = ref(db, `reviews/${id}`);  // Replace 'your_data_path' with the correct path in your database
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
                        All Items
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <Table>
                        <TableRow>
                          <TableCell>No.</TableCell>
                          <TableCell>User ID</TableCell>
                          <TableCell>Category ID</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Review</TableCell>
                          <TableCell>ID Review</TableCell>
                          <TableCell>UID Reviewer</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      <TableBody>
                        {data.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.categoryId}</TableCell>
                            <TableCell>{item.rating}</TableCell>
                            <TableCell>{item.review}</TableCell>
                            <TableCell>{item.uid}</TableCell>
                            <TableCell>{item.userUid}</TableCell>
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

export default Review;
