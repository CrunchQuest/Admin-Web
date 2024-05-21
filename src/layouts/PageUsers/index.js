import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
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

function Users() {
  const [userData, setUserData] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAllUsers = () => {
      const db = getDatabase();
      const usersRef = ref(db, 'users');
      const userLocationsRef = ref(db, 'user_current_location');

      onValue(usersRef, (snapshot) => {
        const users = [];
        snapshot.forEach((childSnapshot) => {
          const user = {
            id: childSnapshot.key,
            emailAddress: childSnapshot.val().emailAddress,
            age: childSnapshot.val().age,
            firstName: childSnapshot.val().firstName,
            lastName: childSnapshot.val().lastName,
          };
          users.push(user);
        });

        // Fetch user locations and merge with user data
        onValue(userLocationsRef, (locationSnapshot) => {
          const userLocations = {};
          locationSnapshot.forEach((childSnapshot) => {
            userLocations[childSnapshot.key] = childSnapshot.val();
          });

          const mergedData = users.map(user => ({
            ...user,
            ...userLocations[user.id]
          }));

          setUserData(mergedData);
        }, (error) => {
          console.error('Error fetching user locations:', error);
        });
      }, (error) => {
        console.error('Error fetching users:', error);
      });
    };

    fetchAllUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const userLocationRef = ref(db, `user_current_location/${userId}`);
    remove(userRef)
      .then(() => {
        // Also remove the user location
        return remove(userLocationRef);
      })
      .then(() => {
        // Remove the user from state after successful deletion
        setUserData(prevUsers => prevUsers.filter(user => user.id !== userId));
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
    handleCloseDialog();
  };

  const handleOpenDialog = (userId) => {
    setDeleteUserId(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteUserId(null);
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={16}>
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
                        <TableRow align="center">
                          <TableCell>No.</TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Age</TableCell>
                          <TableCell>Email Address</TableCell>
                          <TableCell>Latitude</TableCell>
                          <TableCell>Longitude</TableCell>
                          <TableCell>Login Time</TableCell>
                          <TableCell>Action</TableCell> {/* Add Action column */}
                        </TableRow>
                      <TableBody alignItems="center">
                        {userData.map((user, index) => (
                          <TableRow key={user.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                            <TableCell>{user.age}</TableCell>
                            <TableCell>{user.emailAddress}</TableCell>
                            <TableCell>{user.latitude || 'N/A'}</TableCell>
                            <TableCell>{user.longitude || 'N/A'}</TableCell>
                            <TableCell>{user.timestamp ? new Date(user.timestamp).toLocaleString() : 'N/A'}</TableCell>
                            <TableCell>
                              <MDButton
                                onClick={() => handleOpenDialog(user.id)}
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
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeleteUser(deleteUserId)} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Users;
