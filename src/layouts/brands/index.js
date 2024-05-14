import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database'; // Update import statement
import { database } from "../../firebase"; // Assuming you have initialized Firebase Realtime Database

function Brands() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Function to fetch all users from Realtime Database
    const fetchAllUsers = () => {
      const db = getDatabase(); // Get the database instance
      const usersRef = ref(db, 'users'); // Reference to 'users' node
      onValue(usersRef, (snapshot) => { // Listen for value changes
        const users = [];
        snapshot.forEach((childSnapshot) => {
          const user = {
            id: childSnapshot.key,
            emailAddress: childSnapshot.val().emailAddress, // Access properties directly from val()
            verifiedClient: childSnapshot.val().verifiedClient,
            verifiedServiceProvider: childSnapshot.val().verifiedServiceProvider,
          };
          users.push(user);
        });
        setUserData(users);
      }, (error) => {
        console.error('Error fetching users:', error);
      });
    };

    // Call the fetchAllUsers function when the component mounts
    fetchAllUsers();

    // Clean up function (optional)
    return () => {
      // Any cleanup code if needed
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h1>User Data</h1>
      <ul>
        {userData.map((user) => (
          <li key={user.id}>
            <p>ID: {user.id}</p>
            <p>Email Address: {user.emailAddress}</p>
            <p>Verified Client: {user.verifiedClient ? 'Yes' : 'No'}</p>
            <p>Verified Service Provider: {user.verifiedServiceProvider ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Brands;
