import React from "react";

const RegisterConfigUserDetails = ({ location }) => {
  const { firstName, lastName, userEmail } = location.state || {};
  return (
    <div>
      {location?.state ? (
        <div className="details-box">
          <p>
            <span>שם : </span>
            {firstName + " " + lastName}
          </p>
          <p>
            <span>כתובת אימייל : </span>
            {userEmail}
          </p>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default RegisterConfigUserDetails;
