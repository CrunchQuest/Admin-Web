import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import TextField from '@mui/material/TextField';
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';

function Review() {
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editRating, setEditRating] = useState('');
  const [editReview, setEditReview] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase();
      const dataRef = ref(db, 'reviews');
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
    const dataRef = ref(db, `reviews/${id}`);
    remove(dataRef)
      .then(() => {
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

  const handleOpenEditDialog = (id, rating, review) => {
    setEditId(id);
    setEditRating(rating);
    setEditReview(review);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditId(null);
    setEditRating('');
    setEditReview('');
  };

  const handleEdit = () => {
    const db = getDatabase();
    const dataRef = ref(db, `reviews/${editId}`);
    const updatedData = {
      rating: editRating,
      review: editReview,
    };
    update(dataRef, updatedData)
      .then(() => {
        setData(prevData =>
          prevData.map(item =>
            item.id === editId ? { ...item, ...updatedData } : item
          )
        );
        handleCloseEditDialog();
      })
      .catch((error) => {
        console.error('Error editing item:', error);
      });
  };

  const renderStarIcons = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon key={i} style={{ color: i < rating ? 'gold' : 'grey' }} />
      );
    }
    return stars;
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
                        All Review
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <Table>
                      <TableBody>
                        {data.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{renderStarIcons(item.rating)}</TableCell>
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
                              <MDButton
                                onClick={() => handleOpenEditDialog(item.id, item.rating, item.review)}
                                variant="contained"
                                sx={{
                                  backgroundColor: 'blue',
                                  width: '40px',
                                  height: '40px',
                                  minWidth: 'auto',
                                  padding: '5px',
                                  marginLeft: '10px'
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

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
      >
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the review details:
          </DialogContentText>
          <form>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ marginRight: '10px' }}>Rating:</span>
              {renderStarIcons(editRating)}
            </div>
            <TextField
              margin="dense"
              id="editReview"
              label="Review"
              type="text"
              fullWidth
              variant="outlined"
              value={editReview}
              onChange={(e) => setEditReview(e.target.value)}
              style={{ marginBottom: '15px' }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseEditDialog} color="error">
            Cancel
          </MDButton>
          <MDButton onClick={handleEdit} color="success">
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Review;