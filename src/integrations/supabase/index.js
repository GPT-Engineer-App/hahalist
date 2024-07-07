/* supabase integration types

### user

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| username   | text        | string | true     |
| email      | text        | string | true     |
| created_at | timestamptz | string | false    |

### task

| name        | type        | format | required |
|-------------|-------------|--------|----------|
| id          | int8        | number | true     |
| title       | text        | string | true     |
| description | text        | string | false    |
| due_date    | date        | string | false    |
| user_id     | int8        | number | true     |

*/

export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: () => fromSupabase(supabase.from('user').select('*')),
});

export const useUser = (id) => useQuery({
    queryKey: ['user', id],
    queryFn: () => fromSupabase(supabase.from('user').select('*').eq('id', id).single()),
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('user').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedUser) => fromSupabase(supabase.from('user').update(updatedUser).eq('id', updatedUser.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useTasks = () => useQuery({
    queryKey: ['tasks'],
    queryFn: () => fromSupabase(supabase.from('task').select('*')),
});

export const useTask = (id) => useQuery({
    queryKey: ['task', id],
    queryFn: () => fromSupabase(supabase.from('task').select('*').eq('id', id).single()),
});

export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTask) => fromSupabase(supabase.from('task').insert([newTask])),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedTask) => fromSupabase(supabase.from('task').update(updatedTask).eq('id', updatedTask.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('task').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};