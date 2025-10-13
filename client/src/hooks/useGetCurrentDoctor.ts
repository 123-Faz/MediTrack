import { getCurrentDoctor } from "@/services/auth_dr.service";
import { getAuthDoctorToken, setUser } from "@/store/authDoctorSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentDoctor = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(getAuthDoctorToken);

  return useQuery({
    queryKey: ["currentDoctor", token],
    queryFn: async ({ queryKey }) => {
      const [_key, token] = queryKey;
      if (!token) throw new Error("No token found");

      const data = await getCurrentDoctor(token as string);

      // 🔑 normalize response
      const user = data?.user ?? data; // use data.user if available, else data

      if (!user) throw new Error("No user returned from /auth_doctor/me");

      // store in Redux
      dispatch(setUser(user));

      return user;
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
};