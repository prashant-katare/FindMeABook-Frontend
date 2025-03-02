export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  jwtToken: string;
  username: string;
} 
