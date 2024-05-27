import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDSnackbar from "../../components/MDSnackbar";
import { Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox";
import { format } from 'date-fns';
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [editRequest, setEditRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchAllServiceRequests = () => {
      const db = getDatabase();
      const requestsRef = ref(db, 'service_requests');

      onValue(requestsRef, (snapshot) => {
        const requests = [];
        snapshot.forEach((childSnapshot) => {
          const request = {
            id: childSnapshot.key,
            ...childSnapshot.val(),
          };
          requests.push(request);
        });
        setServiceRequests(requests);
      }, (error) => {
        console.error('Error fetching service requests:', error);
      });
    };

    fetchAllServiceRequests();
  }, []);

  const handleDeleteRequest = (requestId) => {
    const db = getDatabase();
    const requestRef = ref(db, `service_requests/${requestId}`);
    remove(requestRef)
      .then(() => {
        // Remove the request from state after successful deletion
        setServiceRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      })
      .catch((error) => {
        console.error('Error deleting service request:', error);
      });
    handleCloseDialog();
  };

  const handleOpenDialog = (requestId) => {
    setDeleteRequestId(requestId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteRequestId(null);
  };

  const handleOpenEditDialog = (request) => {
    setEditRequest(request);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditRequest(null);
  };

  const handleEditRequestChange = (e) => {
    const { name, value } = e.target;
    setEditRequest(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEditRequest = () => {
    const db = getDatabase();
    const requestRef = ref(db, `service_requests/${editRequest.id}`);
    update(requestRef, editRequest)
      .then(() => {
        // Update the request in state after successful update
        setServiceRequests(prevRequests =>
          prevRequests.map(request => request.id === editRequest.id ? editRequest : request)
        );
        handleCloseEditDialog();
      })
      .catch((error) => {
        console.error('Error updating service request:', error);
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
                        All Service Requests
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <Table>
                        <TableRow>
                          <TableCell>No.</TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell>Booked By</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Payment Mode</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      <TableBody>
                        {serviceRequests.map((request, index) => (
                          <TableRow key={request.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{request.id}</TableCell>
                            <TableCell>{request.bookedBy}</TableCell>
                            <TableCell>{request.title}</TableCell>
                            <TableCell>{request.description}</TableCell>
                            <TableCell>{request.category}</TableCell>
                            <TableCell>{request.date}</TableCell>
                            <TableCell>{request.time}</TableCell>
                            <TableCell>Rp.{request.price}</TableCell>
                            <TableCell>{request.modeOfPayment}</TableCell>
                            <TableCell>{request.status}</TableCell>
                            <TableCell>
                              <MDButton
                                onClick={() => handleOpenEditDialog(request)}
                                variant="contained"
                                sx={{
                                  backgroundColor: 'blue',
                                  width: '40px',
                                  height: '40px',
                                  minWidth: 'auto',
                                  padding: '5px',
                                  marginRight: '5px',
                                }}
                              >
                                <EditIcon />
                              </MDButton>
                              <MDButton
                                onClick={() => handleOpenDialog(request.id)}
                                variant="contained"
                                sx={{
                                  backgroundColor: 'red',
                                  width: '40px',
                                  height: '40px',
                                  minWidth: 'auto',
                                  padding: '5px',
                                  marginTop: '10px'
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
            Are you sure you want to delete this service request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="info">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeleteRequest(deleteRequestId)} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
      >
        <DialogTitle>Edit Service Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the service request's details:
          </DialogContentText>
          <form>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              value={editRequest?.title || ''}
              onChange={handleEditRequestChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={editRequest?.description || ''}
              onChange={handleEditRequestChange}
            />
            <TextField
              margin="dense"
              name="category"
              label="Category"
              type="text"
              fullWidth
              value={editRequest?.category || ''}
              onChange={handleEditRequestChange}
            />
            <TextField
              margin="dense"
              name="time"
              label="Time"
              type="time"
              fullWidth
              value={editRequest?.time || ''}
              onChange={handleEditRequestChange}
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              value={editRequest?.price || ''}
              onChange={handleEditRequestChange}
            />
            <RadioGroup
              name="modeOfPayment"
              value={editRequest?.modeOfPayment || ''}
              onChange={handleEditRequestChange}
            >
              <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
              <FormControlLabel value="Mobile Payment" control={<Radio />} label="Mobile Payment" />
            </RadioGroup>
          </form>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseEditDialog} color="error">
            Cancel
          </MDButton>
          <MDButton onClick={handleSaveEditRequest} color="success">
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ServiceRequests;
