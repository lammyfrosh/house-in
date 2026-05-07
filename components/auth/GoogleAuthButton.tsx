"use client";

import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

type GoogleAuthButtonProps = {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError?: () => void;
};

export default function GoogleAuthButton({
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      theme="outline"
      size="large"
      text="continue_with"
      shape="pill"
      width="100%"
    />
  );
}