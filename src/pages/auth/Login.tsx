import React, { useState } from "react";
import LoginButton from "../../components/auth/LoginButton";
import AuthDialog from "../../components/auth/AuthDialog";
import SystemHeader from "../../components/ui/SystemHeader";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowAuthDialog(true);
  };

  const handlePinSubmit = async () => {
    setLoading(true);

    try {
      console.log("Authenticating with PIN:", pin);

      setShowAuthDialog(false);
      setPin("");
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error);

      setPin("");
    } finally {
      setLoading(false);
    }
  };

  //   const handleAuthDialogClose = () => {
  //     if (!loading) {
  //       setShowAuthDialog(false);
  //       setPin("");
  //     }
  //   };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <SystemHeader
        title="TORY CONTROLLER"
        status={{
          type: "fault",
          label: "System Fault",
        }}
      />

      <div className="flex-1  place-content-center  justify-items-center p-8 w-full h-[70vh] ">
        <div className="max-w-md w-full">
          {/* Welcome Message ""<div className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Please authenticate to access the system
              </p>
            </div>" */}

          {/* Login Button */}
          <div className="flex justify-center">
            <LoginButton
              onClick={handleLoginClick}
              loading={loading}
              className="w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Authentication Dialog */}
      <AuthDialog
        pin={pin}
        onPinChange={setPin}
        onSubmit={handlePinSubmit}
        isVisible={showAuthDialog}
      />
    </div>
  );
};

export default Login;
