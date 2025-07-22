import { useQuery } from "@tanstack/react-query";
import UseAuth from "./UseAuth";
import UseAxiosSecure from "./UseAxiosSecure";


function UseUserRole() {
    const { user, loading } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: role = null, isLoading: roleLoading, refetch } = useQuery({
        queryKey: ["user-role", user?.email],
        enabled: !loading && !!user?.email, // Only run when user and email exist
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data.role;
        },
    });

    return { role, roleLoading, refetch };
}

export default UseUserRole;
