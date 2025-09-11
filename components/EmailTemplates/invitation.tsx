import { HOST_URL, ROUTES } from "@/utils/constants";

export function InvitationEmailTemplate() {
  return (
    <div>
      <h1>Congratulations!</h1>
      <p>You have been invited to join Senex Tours.</p>
      <p>Please click the link below to complete your registration:</p>
      <a href={`${HOST_URL}${ROUTES.SIGNIN}`}>Complete Registration</a>
      <p>
        If you have any questions, please contact us at{" "}
        <a href="mailto:support@senextours.com">support@senextours.com</a>.
      </p>
    </div>
  );
}
