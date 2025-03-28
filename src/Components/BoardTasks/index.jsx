// "use client";

// import { useState, useEffect } from "react";
// import { Reorder } from "framer-motion";
// import {
//   BoardContainer,
//   Column,
//   ColumnTitle,
//   TaskPlaceholder,
//   TaskInputContainer,
//   TaskInput,
//   TaskButtonContainer,
//   TaskButton,
//   CancelButton,
//   AddListButton,
// } from "./styledCompoonents";
// import Navbar from "../Navbar";
// import { motion } from "framer-motion";
// import { useParams } from "next/navigation";

// const BoardTasks = () => {
//   const [lists, setLists] = useState([]);
//   const [nextTaskId, setNextTaskId] = useState(1);
//   const [addingNewList, setAddingNewList] = useState(false);
//   const [newListTitle, setNewListTitle] = useState("");
//   const params = useParams();
//   const boardId = params.board?.toString().trim();

//   // useEffect(() => {
//   //   const fetchLists = async () => {
//   //     try {
//   //       const response = await fetch(`/api/boards/${boardId}/lists`, {
//   //         method: "GET",
//   //       });
//   //       if (!response.ok) {
//   //         const errorData = await response.json();
//   //         throw new Error(`Failed to fetch lists: ${errorData.message}`);
//   //       }
//   //       const data = await response.json();
//   //       const formattedLists = (data.lists || []).map((list) => ({
//   //         ...list,
//   //         title: list.listName,
//   //         tasks: list.taskIds || [],
//   //         addingTask: false,
//   //       }));
//   //       setLists(formattedLists);
//   //     } catch (error) {
//   //       console.error("Error fetching lists:", error.message);
//   //     }
//   //   };

//   //   if (boardId) {
//   //     fetchLists();
//   //   } else {
//   //     console.error("Board ID is missing");
//   //   }
//   // }, [boardId]);

//   // const handleAddTask = (index, taskText) => {
//   //   if (taskText.trim()) {
//   //     const newTask = { id: nextTaskId, text: taskText };
//   //     const newLists = [...lists];
//   //     newLists[index].tasks.push(newTask);
//   //     newLists[index].addingTask = false;
//   //     setLists(newLists);
//   //     setNextTaskId(nextTaskId + 1);
//   //   }
//   // };

//   useEffect(() => {
//     const fetchLists = async () => {
//       try {
//         if (!boardId) {
//           console.error("Board ID is missing");
//           return;
//         }

//         // Fetch lists for the board
//         const response = await fetch(`/api/boards/${boardId}/lists`);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Failed to fetch lists: ${errorData.message}`);
//         }

//         const data = await response.json();
//         const formattedLists = (data.lists || []).map((list) => ({
//           ...list,
//           title: list.listName,
//           tasks: [],
//           addingTask: false,
//         }));

//         setLists(formattedLists);

//         // Fetch tasks for each list
//         for (let i = 0; i < formattedLists.length; i++) {
//           fetchTasksForList(formattedLists[i]._id, i);
//         }
//       } catch (error) {
//         console.error("Error fetching lists:", error.message);
//       }
//     };

//     const fetchTasksForList = async (listId, index) => {
//       try {
//         if (!boardId || !listId) return;

//         const response = await fetch(`/api/boards/${boardId}/lists/${listId}`);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Failed to fetch tasks: ${errorData.message}`);
//         }

//         const { tasks } = await response.json();

//         setLists((prevLists) => {
//           const updatedLists = [...prevLists];
//           updatedLists[index].tasks = tasks;
//           return updatedLists;
//         });
//       } catch (error) {
//         console.error("Error fetching tasks:", error.message);
//       }
//     };

//     if (boardId) {
//       fetchLists();
//     }
//   }, [boardId]);
//   const handleAddTask = async (index, taskText) => {
//     if (!taskText.trim()) return;

//     const listName = lists[index].title;
//     if (!boardId || !listName) {
//       console.error("Board ID or List Name missing:", { boardId, listName });
//       return;
//     }

//     try {
//       const response = await fetch(
//         `/api/boards/${boardId}/lists/${encodeURIComponent(listName)}/tasks`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ taskName: taskText }),
//         }
//       );

//       console.log("Raw response:", response);

//       if (!response.ok) {
//         console.error("Failed Response:", response.status, response.statusText);
//         const errorText = await response.text(); // Read as text before parsing
//         console.error("Error response text:", errorText);
//         throw new Error(`Failed to add task: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("API Response Data:", data);

//       const updatedLists = [...lists];
//       updatedLists[index].tasks = data.updatedList.lists.find(
//         (list) => list.listName === listName
//       ).tasks;

//       setLists(updatedLists);
//     } catch (error) {
//       console.error("Error adding task:", error.message);
//     }
//   };

//   const toggleTaskInput = (index) => {
//     const newLists = [...lists];
//     newLists[index].addingTask = !newLists[index].addingTask;
//     setLists(newLists);
//   };

//   const handleAddList = async () => {
//     if (!newListTitle.trim() || !boardId) {
//       console.error("Invalid boardId or list title:", {
//         boardId,
//         newListTitle,
//       });
//       return;
//     }

//     try {
//       const requestBody = JSON.stringify({ listName: newListTitle });
//       console.log("Request Body:", requestBody);

//       const response = await fetch(`/api/boards/${boardId}/lists`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: requestBody,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Failed to add list. Response:", errorData);
//         throw new Error(`Failed to add list: ${errorData.message}`);
//       }

//       const { newList } = await response.json();
//       const formattedNewList = {
//         ...newList,
//         title: newList.listName,
//         tasks: newList.taskIds || [],
//         addingTask: false,
//       };
//       setLists([...lists, formattedNewList]);
//       setNewListTitle("");
//       setAddingNewList(false);
//     } catch (error) {
//       console.error("Error adding list:", error.message);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <BoardContainer>
//         {lists.map((list, index) => (
//           <Column key={index}>
//             <ColumnTitle>{list.title}</ColumnTitle>

//             {list.addingTask ? (
//               <TaskInputContainer>
//                 <TaskInput
//                   type="text"
//                   placeholder="Enter task..."
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleAddTask(index, e.target.value);
//                       e.target.value = "";
//                     }
//                   }}
//                 />
//                 <TaskButtonContainer>
//                   <TaskButton
//                     onClick={() => {
//                       const input = document.querySelector(
//                         `input[placeholder="Enter task..."]`
//                       );
//                       if (input?.value.trim()) {
//                         handleAddTask(index, input.value);
//                         input.value = "";
//                       }
//                     }}
//                   >
//                     Add Task
//                   </TaskButton>
//                   <CancelButton onClick={() => toggleTaskInput(index)}>
//                     ✖
//                   </CancelButton>
//                 </TaskButtonContainer>
//               </TaskInputContainer>
//             ) : (
//               <TaskPlaceholder onClick={() => toggleTaskInput(index)}>
//                 + Add a task
//               </TaskPlaceholder>
//             )}
//           </Column>
//         ))}

//         {addingNewList ? (
//           <TaskInputContainer>
//             <TaskInput
//               type="text"
//               placeholder="Enter list title..."
//               value={newListTitle}
//               onChange={(e) => setNewListTitle(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   if (newListTitle.trim()) {
//                     setLists([
//                       ...lists,
//                       { title: newListTitle, tasks: [], addingTask: false },
//                     ]);
//                     setAddingNewList(false);
//                     setNewListTitle("");
//                   }
//                 }
//               }}
//             />
//             <TaskButtonContainer>
//               <TaskButton onClick={handleAddList}>Add List</TaskButton>
//               <CancelButton onClick={() => setAddingNewList(false)}>
//                 ✖
//               </CancelButton>
//             </TaskButtonContainer>
//           </TaskInputContainer>
//         ) : (
//           <AddListButton onClick={() => setAddingNewList(true)}>
//             + Add another list
//           </AddListButton>
//         )}
//       </BoardContainer>
//     </>
//   );
// };

// export default BoardTasks;

"use client";

import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import {
  BoardContainer,
  Column,
  ColumnTitle,
  TaskPlaceholder,
  TaskInputContainer,
  TaskInput,
  TaskButtonContainer,
  TaskButton,
  CancelButton,
  AddListButton,
} from "./styledCompoonents";
import Navbar from "../Navbar";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const BoardTasks = () => {
  const [lists, setLists] = useState([]);
  const [nextTaskId, setNextTaskId] = useState(1);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const boardId = params.board?.toString().trim();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching lists for boardId:", boardId);

        const response = await fetch(`/api/boards/${boardId}/lists`, {
          method: "GET",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch lists: ${errorData.message}`);
        }
        const data = await response.json();
        const formattedLists = (data.lists || []).map((list) => ({
          id: list._id,
          title: list.listName,
          tasks: [],
          addingTask: false,
        }));

        const listsWithTasks = await Promise.all(
          formattedLists.map(async (list) => {
            try {
              const tasksResponse = await fetch(
                `/api/boards/${boardId}/lists/${list.id}/tasks`,
                {
                  method: "GET",
                }
              );
              if (!tasksResponse.ok) {
                const errorData = await tasksResponse.json();
                console.error(
                  `Failed to fetch tasks for list ${list.title}:`,
                  errorData
                );
                return { ...list, tasks: [] };
              }
              const tasksData = await tasksResponse.json();
              return {
                ...list,
                tasks: tasksData.tasks || [],
              };
            } catch (error) {
              console.error(
                `Error fetching tasks for list ${list.title}:`,
                error.message
              );
              return { ...list, tasks: [] };
            }
          })
        );

        setLists(listsWithTasks);
      } catch (error) {
        console.error("Error fetching lists:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (boardId) {
      fetchLists();
    } else {
      console.error("Board ID is missing");
      setError("Board ID is missing");
      setLoading(false);
    }
  }, [boardId]);

  const handleAddTask = async (index, taskText) => {
    if (!taskText.trim()) return;

    const listId = lists[index].id;
    if (!boardId || !listId) {
      console.error("Board ID or List ID missing:", { boardId, listId });
      return;
    }

    try {
      const response = await fetch(
        `/api/boards/${boardId}/lists/${listId}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskName: taskText }),
        }
      );

      console.log("Raw response:", response);

      if (!response.ok) {
        console.error("Failed Response:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`Failed to add task: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      const updatedLists = [...lists];
      updatedLists[index].tasks = data.updatedList.lists.find(
        (list) => list._id === listId
      ).taskIds;

      setLists(updatedLists);
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  const toggleTaskInput = (index) => {
    const newLists = [...lists];
    newLists[index].addingTask = !newLists[index].addingTask;
    setLists(newLists);
  };

  const handleAddList = async () => {
    if (!newListTitle.trim() || !boardId) {
      console.error("Invalid boardId or list title:", {
        boardId,
        newListTitle,
      });
      return;
    }

    try {
      const requestBody = JSON.stringify({ listName: newListTitle });
      console.log("Request Body:", requestBody);

      const response = await fetch(`/api/boards/${boardId}/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add list. Response:", errorData);
        throw new Error(`Failed to add list: ${errorData.message}`);
      }

      const { newList } = await response.json();
      const formattedNewList = {
        id: newList._id,
        title: newList.listName,
        tasks: newList.taskIds || [],
        addingTask: false,
      };
      setLists([...lists, formattedNewList]);
      setNewListTitle("");
      setAddingNewList(false);
    } catch (error) {
      console.error("Error adding list:", error.message);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <BoardContainer>
          <p>Loading...</p>
        </BoardContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <BoardContainer>
          <p style={{ color: "red" }}>Error: {error}</p>
        </BoardContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <BoardContainer>
        {lists.map((list, index) => (
          <Column key={list.id}>
            <ColumnTitle>{list.title}</ColumnTitle>

            {list.addingTask ? (
              <TaskInputContainer>
                <TaskInput
                  type="text"
                  placeholder="Enter task..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTask(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <TaskButtonContainer>
                  <TaskButton
                    onClick={() => {
                      const input = document.querySelector(
                        `input[placeholder="Enter task..."]`
                      );
                      if (input?.value.trim()) {
                        handleAddTask(index, input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add Task
                  </TaskButton>
                  <CancelButton onClick={() => toggleTaskInput(index)}>
                    ✖
                  </CancelButton>
                </TaskButtonContainer>
              </TaskInputContainer>
            ) : (
              <TaskPlaceholder onClick={() => toggleTaskInput(index)}>
                + Add a task
              </TaskPlaceholder>
            )}

            {list.tasks.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "10px 0" }}>
                {list.tasks.map((task) => (
                  <li
                    key={task._id}
                    style={{
                      background: "#f0f0f0",
                      padding: "8px",
                      margin: "3px 0",
                      borderRadius: "3px",
                      textAlign: "left",
                      color: "black",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {task.text}
                  </li>
                ))}
              </ul>
            )}
          </Column>
        ))}

        {addingNewList ? (
          <TaskInputContainer>
            <TaskInput
              type="text"
              placeholder="Enter list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newListTitle.trim()) {
                  handleAddList();
                }
              }}
            />
            <TaskButtonContainer>
              <TaskButton onClick={handleAddList}>Add List</TaskButton>
              <CancelButton onClick={() => setAddingNewList(false)}>
                ✖
              </CancelButton>
            </TaskButtonContainer>
          </TaskInputContainer>
        ) : (
          <AddListButton onClick={() => setAddingNewList(true)}>
            + Add another list
          </AddListButton>
        )}
      </BoardContainer>
    </>
  );
};

export default BoardTasks;
