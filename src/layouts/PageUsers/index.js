import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { getAuth, deleteUser } from 'firebase/auth';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox";
import Box from '@mui/material/Box';
import TextField from '@material-ui/core/TextField';
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Users() {
  const [userData, setUserData] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editEmailAddress, setEditEmailAddress] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

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
    const auth = getAuth();
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const userLocationRef = ref(db, `user_current_location/${userId}`);
  
    // Remove the user from Firebase Authentication
    deleteUser(auth.currentUser)
      .then(() => {
        // Remove the user from the 'users' collection
        remove(userRef);
        // Remove the user's location
        remove(userLocationRef);
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

  const handleOpenEditDialog = (userId) => {
    const userToEdit = userData.find(user => user.id === userId);
    if (userToEdit) {
      setEditUserId(userId);
      setEditName(`${userToEdit.firstName} ${userToEdit.lastName}`);
      setEditAge(userToEdit.age);
      setEditEmailAddress(userToEdit.emailAddress);
      setOpenEditDialog(true);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditUserId(null);
    setEditName('');
    setEditAge('');
    setEditEmailAddress('');
  };

  const handleEditUser = () => {
    if (!editName || !editName.includes(' ')) {
      console.error('Invalid editName:', editName);
      return;
    }
  
    const [editedFirstName, editedLastName] = editName.split(' ');
    const editedUserData = {
      firstName: editedFirstName,
      lastName: editedLastName,
      age: editAge,
      emailAddress: editEmailAddress
    };
  
    const db = getDatabase();
    const userRef = ref(db, `users/${editUserId}`);
    update(userRef, editedUserData)
      .then(() => {
        setUserData(prevUsers =>
          prevUsers.map(user =>
            user.id === editUserId ? { ...user, ...editedUserData } : user
          )
        );
        handleCloseEditDialog();
      })
      .catch((error) => {
        console.error('Error editing user:', error);
      });
  };  

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={25}>
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
                  <MDBox pt={2} pb={2} px={2} display="flex" justifyContent="space-between" alignItems="center" color="grape">
                    <MDTypography variant="h6" fontWeight="medium" color="white">
                      All Users
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox pt={3} textAlign="center"> {/* Center the table */}
                  <Table>
                    {/* Table Header */}
                      <TableRow align="center">
                        <TableCell>No.</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Email Address</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                        <TableCell>Login Time</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    {/* Table Body */}
                    <TableBody>
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
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '10px' // Adjust the gap between buttons as needed
                            }}
                          >
                            <MDButton
                              onClick={() => handleOpenDialog(user.id)}
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
                              onClick={() => handleOpenEditDialog(user.id)}
                              variant="contained"
                              sx={{
                                backgroundColor: 'blue',
                                width: '40px',
                                height: '40px',
                                minWidth: 'auto',
                                padding: '5px',
                              }}
                            >
                              <EditIcon />
                            </MDButton>
                            </Box>
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
          <MDButton onClick={handleCloseDialog} color="info">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeleteUser(deleteUserId)} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
  open={openEditDialog}
  onClose={handleCloseEditDialog}
>
  <DialogTitle>Edit User</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Edit the user's details:
    </DialogContentText>
    <form>
      <TextField
        autoFocus
        margin="dense"
        id="editName"
        label="Name"
        type="text"
        fullWidth
        variant="outlined"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <TextField
        autoFocus
        margin="dense"
        id="editAge"
        label="Age"
        type="number"
        fullWidth
        variant="outlined"
        value={editAge}
        onChange={(e) => setEditAge(e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <TextField
        autoFocus
        margin="dense"
        id="editEmailAddress"
        label="Email Address"
        type="email"
        fullWidth
        variant="outlined"
        value={editEmailAddress}
        onChange={(e) => setEditEmailAddress(e.target.value)}
        style={{ marginBottom: '15px' }}
      />
    </form>
  </DialogContent>
  <DialogActions>
    <MDButton onClick={handleCloseEditDialog} color="info">
      Cancel
    </MDButton>
    <MDButton onClick={handleEditUser} color="success">
      Save
    </MDButton>
  </DialogActions>
</Dialog>

    </>
  );
}

export default Users;
