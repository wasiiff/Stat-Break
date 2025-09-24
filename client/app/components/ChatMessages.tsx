"use client";
import { BarChart3 } from "lucide-react";
import { Message } from "../@types/types";

export interface ChatMessagesProps {
  history: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  formatCellValue: (value: unknown) => string;
}


export default function ChatMessages({
  history,
  isLoading,
  messagesEndRef,
  formatCellValue,
}: ChatMessagesProps) {
  const renderMessage = (m: Message, i: number) => {
    if (m.role === "user" && typeof m.payload === "string") {
      return (
        <div key={i} className="flex justify-end mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-3xl max-w-xs lg:max-w-2xl shadow-lg">
            <p className="text-sm font-medium">{m.payload}</p>
          </div>
        </div>
      );
    }

    if (typeof m.payload === "object" && m.payload.type === "text") {
      return (
        <div key={i} className="flex justify-start mb-4">
          <div className="bg-white text-gray-800 px-6 py-4 rounded-3xl shadow-md border border-gray-100 max-w-xs lg:max-w-2xl">
            <p className="text-sm leading-relaxed">{m.payload.text}</p>
          </div>
        </div>
      );
    }

    if (typeof m.payload === "object" && m.payload.type === "table") {
      const filteredColumns = m.payload.columns.filter(
        (c) => c && c.toLowerCase() !== "_id" && !c.toLowerCase().startsWith("unnamed")
      );

      const columnIndexes = m.payload.columns
        .map((c, index) =>
          c && c.toLowerCase() !== "_id" && !c.toLowerCase().startsWith("unnamed") ? index : null
        )
        .filter((i) => i !== null) as number[];

      const filteredRows = m.payload.rows.map((row) => columnIndexes.map((i) => row[i]));

      return (
        <div key={i} className="flex justify-start mb-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-full overflow-hidden">
            {m.payload.text && (
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                  {m.payload.text}
                </p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    {filteredColumns.map((c, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-blue-50/50 transition-colors duration-150`}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-medium"
                        >
                          {formatCellValue(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {filteredRows.length} record{filteredRows.length !== 1 ? "s" : ""} displayed
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-6">
      <div className="h-96 lg:h-[500px] overflow-auto p-6">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Ready to explore cricket stats!</p>
              <p className="text-sm">Ask me anything about cricket statistics and records.</p>
            </div>
          </div>
        ) : (
          history.map((m, i) => renderMessage(m, i))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white px-6 py-4 rounded-3xl shadow-md border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
                <span className="text-sm text-gray-600 ml-2">Analyzing cricket data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
