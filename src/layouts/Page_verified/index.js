import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Table, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@material-ui/core/TextField';
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Verif() {
  const [userData, setUserData] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [verificationUserId, setVerificationUserId] = useState(null);
  const [openVerificationDialog, setOpenVerificationDialog] = useState(false);

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
            firstName: childSnapshot.val().firstName,
            lastName: childSnapshot.val().lastName,
            age: childSnapshot.val().age,
            verifiedClient: childSnapshot.val().verifiedClient,
            idImageUrl: childSnapshot.val().idImageUrl,  // Fetch the idImageUrl
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

  const handleOpenImageDialog = (src) => {
    setImageSrc(src);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setImageSrc('');
  };

  const handleOpenVerificationDialog = (userId) => {
    setVerificationUserId(userId);
    setOpenVerificationDialog(true);
  };

  const handleCloseVerificationDialog = () => {
    setOpenVerificationDialog(false);
    setVerificationUserId(null);
  };

  const handleVerifyUser = () => {
    const db = getDatabase();
    const userRef = ref(db, `users/${verificationUserId}`);
    update(userRef, { verifiedClient: 'VERIFIED' })
      .then(() => {
        setUserData(prevUsers =>
          prevUsers.map(user =>
            user.id === verificationUserId ? { ...user, verifiedClient: 'VERIFIED' } : user
          )
        );
        handleCloseVerificationDialog();
      })
      .catch((error) => {
        console.error('Error verifying user:', error);
      });
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
                        <TableCell>Image KTP</TableCell>
                        <TableCell>Verified Client</TableCell>
                        <TableCell>Verification</TableCell>
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
                          <TableCell>
                            <img 
                              src={`data:image/jpeg;base64,${user.idImageUrl}`} 
                              alt="User ID" 
                              style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                              onClick={() => handleOpenImageDialog(`data:image/jpeg;base64,${user.idImageUrl}`)}
                            />
                          </TableCell>
                          <TableCell>{user.verifiedClient}</TableCell>
                          <TableCell>
                            <MDButton
                              onClick={() => handleOpenVerificationDialog(user.id)}
                              variant="contained"
                              sx={{
                                backgroundColor: user.verifiedClient === 'VERIFIED' ? 'green' : 'orange',
                                width: '100px',
                                height: '40px',
                                minWidth: 'auto',
                                padding: '5px',
                                color: 'white'
                              }}
                            >
                              {user.verifiedClient === 'VERIFIED' ? 'VERIFIED' : 'VERIFY'}
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

      <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
  <DialogTitle>Image Preview</DialogTitle>
  <DialogContent>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  </DialogContent>
  <DialogActions>
    <MDButton onClick={handleCloseImageDialog} color="error">
      Close
    </MDButton>
  </DialogActions>
</Dialog>

<Dialog
  open={openVerificationDialog}
  onClose={handleCloseVerificationDialog}
>
  <DialogTitle style={{ fontFamily: 'Arial, sans-serif' }}>
    {userData.find(user => user.id === verificationUserId)?.verifiedClient === 'VERIFIED' ? 
      "User Verified" : "Verify User"
    }
  </DialogTitle>
  <DialogContent>
    {userData.find(user => user.id === verificationUserId)?.verifiedClient === 'VERIFIED' ? (
      <DialogContentText>
        This user has already been verified.
      </DialogContentText>
    ) : (
      <>
        {verificationUserId && (
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px', gap: '10px'}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #ccc' }}>
                <Typography variant="body1" style={{ fontFamily: 'Arial, sans-serif' }}><strong>ID:</strong> {verificationUserId}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #ccc' }}>
                <Typography variant="body1" style={{ fontFamily: 'Arial, sans-serif' }}><strong>Name:</strong> {userData.find(user => user.id === verificationUserId)?.firstName} {userData.find(user => user.id === verificationUserId)?.lastName}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #ccc' }}>
                <Typography variant="body1" style={{ fontFamily: 'Arial, sans-serif' }}><strong>Age:</strong> {userData.find(user => user.id === verificationUserId)?.age}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <img
                    src={`data:image/jpeg;base64,${userData.find(user => user.id === verificationUserId)?.idImageUrl}`}
                    alt="User ID"
                    style={{ width: '200px', height: '200px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions style={{ justifyContent: 'center' }}>
    {userData.find(user => user.id === verificationUserId)?.verifiedClient === 'VERIFIED' ? (
      <MDButton onClick={handleCloseVerificationDialog} color="error">
        Close
      </MDButton>
    ) : (
      <>
        <MDButton onClick={handleCloseVerificationDialog} color="error">
          Cancel
        </MDButton>
        <MDButton onClick={handleVerifyUser} color="success" variant="contained">
          Verify
        </MDButton>
      </>
    )}
  </DialogActions>
</Dialog>

    </>
  );
}

export default Verif;
