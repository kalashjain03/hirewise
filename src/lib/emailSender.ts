export async function sendInterviewEmail({ email, name, interviewUrl }: { email: string; name: string; interviewUrl: string }) {
  // Placeholder email sender. Integrate your email provider here.
  // For now, return an object indicating the email was not sent and include the interviewUrl for testing.
  return {
    sent: false,
    message: 'Email provider not configured. Implement sendInterviewEmail to integrate.',
    interviewUrl,
    email,
    name,
  }
}
