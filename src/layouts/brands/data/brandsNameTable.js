import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { database } from "../../../firebase"; // Import the database object from firebase.js

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

function Data() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Function to fetch all users from Realtime Database
    const fetchAllUsers = () => {
      const usersRef = database.ref('users'); // Reference to the 'users' node in your Realtime Database
      usersRef.on('value', (snapshot) => {
        const userList = []; // Initialize an empty array to store users
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val(); // Get the user data from the snapshot
          userList.push({ id: childSnapshot.key, ...user }); // Add user to the userList array
        });
        setUsers(userList); // Update the state with the userList
      }, (error) => {
        console.error("Error fetching users:", error);
      });
    };

    // Call the fetchAllUsers function when the component mounts
    fetchAllUsers();

    // Return a cleanup function to unsubscribe from the Realtime Database listener
    return () => {
      database.ref('users').off(); // Unsubscribe from the 'users' node
    };
  }, []);

  return {
    columns: [
      { Header: "SR NO#", accessor: "srNo", width: '10%', align: "left" },
      { Header: "Name & Email", accessor: "nameAndEmail", align: "left" },
      { Header: "Verified Client", accessor: "verifiedClient", align: "center" },
      { Header: "Verified Service Provider", accessor: "verifiedServiceProvider", align: "center" },
      { Header: "Action", accessor: "action", align: "right" }
    ],
    rows: users.map((user, index) => ({
      srNo: index + 1,
      nameAndEmail: (
        <MDBox display="flex" alignItems="center">
          <MDAvatar src={user.profileImageUrl} name={`${user.firstName} ${user.lastName}`} size="sm" />
          <MDBox ml={2}>
            <MDTypography variant="body1">{`${user.firstName} ${user.lastName}`}</MDTypography>
            <MDTypography variant="body2">{user.emailAddress}</MDTypography>
          </MDBox>
        </MDBox>
      ),
      verifiedClient: user.verifiedClient ? "Yes" : "No",
      verifiedServiceProvider: user.verifiedServiceProvider ? "Yes" : "No",
      action: (
        <Link to={`/admin/users/detail/${user.id}`}>
          <MDButton variant="gradient" color="info" size="small">Detail</MDButton>
        </Link>
      ),
    }))
  };
}

export default Data;
