import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { database } from "../../firebase";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDSnackbar from "../../components/MDSnackbar";
import { Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from '@mui/material';
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Info() {
  const [sellerData, setSellerData] = useState([]);
  const [deleteSellerId, setDeleteSellerId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editSellerId, setEditSellerId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editEducationalAttainment, setEditEducationalAttainment] = useState('');
  const [editPreviousSchool, setEditPreviousSchool] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

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
    setOpenDeleteDialog(false);
  };

  const handleOpenDeleteDialog = (sellerId) => {
    setDeleteSellerId(sellerId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteSellerId(null);
  };

  const handleOpenEditDialog = (sellerId) => {
    const sellerToEdit = sellerData.find(seller => seller.id === sellerId);
    if (sellerToEdit) {
      setEditSellerId(sellerId);
      setEditDescription(sellerToEdit.description);
      setEditEducationalAttainment(sellerToEdit.educationalAttainment);
      setEditPreviousSchool(sellerToEdit.previousSchool);
      setOpenEditDialog(true);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditSellerId(null);
    setEditDescription('');
    setEditEducationalAttainment('');
    setEditPreviousSchool('');
  };

  const handleEditSeller = () => {
    const db = getDatabase();
    const sellerRef = ref(db, `user_seller_info/${editSellerId}`);
    update(sellerRef, {
      description: editDescription,
      educationalAttainment: editEducationalAttainment,
      previousSchool: editPreviousSchool
    })
    .then(() => {
      setSellerData(prevSellers =>
        prevSellers.map(seller =>
          seller.id === editSellerId ? { ...seller, description: editDescription, educationalAttainment: editEducationalAttainment, previousSchool: editPreviousSchool } : seller
        )
      );
      handleCloseEditDialog();
    })
    .catch((error) => {
      console.error('Error editing seller:', error);
    });
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
                              onClick={() => handleOpenDeleteDialog(seller.id)}
                              variant="contained"
                              sx={{
                                backgroundColor: 'red',
                                width: '40px',
                                height: '40px',
                                minWidth: 'auto',
                                padding: '5px',
                                color: 'white'
                              }}
                              >
                                <DeleteIcon />
                              </MDButton>
                              <MDButton
                              onClick={() => handleOpenEditDialog(seller.id)}
                              variant="contained"
                              sx={{
                                backgroundColor: 'blue',
                                width: '40px',
                                height: '40px',
                                minWidth: 'auto',
                                padding: '5px',
                                marginTop: '10px',
                              }}
                              >
                                <EditIcon />
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
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this seller?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDeleteDialog} color="info">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeleteSeller(deleteSellerId)} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
      >
        <DialogTitle>Edit Seller</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            id="educationalAttainment"
            label="Educational Attainment"
            type="text"
            fullWidth
            value={editEducationalAttainment}
            onChange={(e) => setEditEducationalAttainment(e.target.value)}
          />
          <TextField
            margin="dense"
            id="previousSchool"
            label="Previous School"
            type="text"
            fullWidth
            value={editPreviousSchool}
            onChange={(e) => setEditPreviousSchool(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseEditDialog} color="error">
            Cancel
          </MDButton>
          <MDButton onClick={handleEditSeller} color="info">
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Info;

