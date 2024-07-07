import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// Hooks for task table
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

// Hooks for user table
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