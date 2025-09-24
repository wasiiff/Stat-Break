import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    askQuestion: builder.mutation<
      any,
      { question: string; format?: "test" | "odi" | "t20" | "all" }
    >({
      query: ({ question, format }) => ({
        url: "/matches/ask",
        method: "POST",
        body: { question, format },
      }),
    }),
    getHistory: builder.query<any, string>({
      query: (userId) => `/user/history/${userId}`,
    }),
  }),
});

export const { useAskQuestionMutation, useGetHistoryQuery } = chatApi;
