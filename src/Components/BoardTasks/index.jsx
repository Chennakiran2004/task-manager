// "use client";

// import { useState, useEffect } from "react";
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
//   TaskCard,
//   AddListButton,
// } from "./styledCompoonents";
// import Navbar from "../Navbar";
// import { useParams } from "next/navigation";

// const BoardTasks = () => {
//   const [lists, setLists] = useState([]);
//   const [addingNewList, setAddingNewList] = useState(false);
//   const [newListTitle, setNewListTitle] = useState("");
//   const params = useParams();
//   const boardId = params.board?.toString().trim();

//   useEffect(() => {
//     const fetchLists = async () => {
//       try {
//         if (!boardId) {
//           console.error("Board ID is missing");
//           return;
//         }

//         const response = await fetch(`/api/boards/${boardId}/lists`);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Failed to fetch lists: ${errorData.message}`);
//         }

//         const data = await response.json();
//         const formattedLists = (data.lists || []).map((list) => ({
//           ...list,
//           title: list.listName,
//           tasks: list.tasks || [],
//           addingTask: false,
//         }));

//         setLists(formattedLists);

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

//     const listId = lists[index]._id;
//     if (!boardId || !listId) {
//       console.error("Board ID or List ID missing:", { boardId, listId });
//       return;
//     }

//     try {
//       const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ taskName: taskText }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to add task: ${errorText}`);
//       }

//       const data = await response.json();
//       const updatedLists = [...lists];
//       updatedLists[index].tasks = data.updatedList.tasks;

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
//       const response = await fetch(`/api/boards/${boardId}/lists`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ listName: newListTitle }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Failed to add list: ${errorData.message}`);
//       }

//       const { newList } = await response.json();
//       const formattedNewList = {
//         ...newList,
//         title: newList.listName,
//         tasks: [],
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

//             {list.tasks?.map((task) => (
//               <TaskCard key={task._id}>{task.text}</TaskCard>
//             ))}

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
//                   handleAddList();
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

// =============================================

// "use client";

// import { useState, useEffect } from "react";
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
//   TaskCard,
//   AddListButton,
// } from "./styledCompoonents";
// import Navbar from "../Navbar";
// import { useParams } from "next/navigation";

// const BoardTasks = () => {
//   const [lists, setLists] = useState([]);
//   const [addingNewList, setAddingNewList] = useState(false);
//   const [newListTitle, setNewListTitle] = useState("");
//   const [newTaskTexts, setNewTaskTexts] = useState({}); // Track task input per list
//   const params = useParams();
//   const boardId = params.board?.toString().trim();

//   useEffect(() => {
//     const fetchLists = async () => {
//       try {
//         if (!boardId) {
//           console.error("Board ID is missing");
//           return;
//         }

//         const response = await fetch(`/api/boards/${boardId}/lists`);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Failed to fetch lists: ${errorData.message}`);
//         }

//         const data = await response.json();
//         const formattedLists = (data.lists || []).map((list) => ({
//           ...list,
//           title: list.listName,
//           tasks: list.tasks || [],
//           addingTask: false,
//         }));

//         setLists(formattedLists);

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

//   // const handleAddTask = async (index, taskText) => {
//   //   if (!taskText.trim()) return;

//   //   const listId = lists[index]._id;
//   //   if (!boardId || !listId) {
//   //     console.error("Board ID or List ID missing:", { boardId, listId });
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ taskName: taskText }),
//   //     });

//   //     if (!response.ok) {
//   //       const errorText = await response.text();
//   //       throw new Error(`Failed to add task: ${errorText}`);
//   //     }

//   //     const data = await response.json();

//   //     // Update the state with the new task
//   //     setLists((prevLists) => {
//   //       const updatedLists = [...prevLists];
//   //       // Use the correct property from the response
//   //       const newTasks = data.task || data.updatedList?.tasks || [];
//   //       updatedLists[index].tasks = [...updatedLists[index].tasks, ...newTasks];
//   //       updatedLists[index].addingTask = false;
//   //       return updatedLists;
//   //     });

//   //     // Clear the input for this list
//   //     setNewTaskTexts((prev) => ({ ...prev, [index]: "" }));
//   //   } catch (error) {
//   //     console.error("Error adding task:", error.message);
//   //   }
//   // };

//   const handleAddTask = async (index, taskText) => {
//     if (!taskText.trim()) return;

//     const listId = lists[index]._id;
//     if (!boardId || !listId) return;

//     try {
//       // Disable the button to prevent multiple submissions
//       setLists((prevLists) => {
//         const updatedLists = [...prevLists];
//         updatedLists[index].isAdding = true; // Add loading state
//         return updatedLists;
//       });

//       const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ taskName: taskText }),
//       });

//       if (!response.ok) throw new Error("Failed to add task");

//       const data = await response.json();

//       // Update state using the task from response
//       setLists((prevLists) => {
//         const updatedLists = [...prevLists];
//         // Check if task already exists to prevent duplicates
//         const taskExists = updatedLists[index].tasks.some(
//           (task) => task._id === data.task._id
//         );

//         if (!taskExists) {
//           updatedLists[index].tasks = [...updatedLists[index].tasks, data.task];
//         }

//         updatedLists[index].addingTask = false;
//         updatedLists[index].isAdding = false;
//         return updatedLists;
//       });

//       setNewTaskTexts((prev) => ({ ...prev, [index]: "" }));
//     } catch (error) {
//       console.error("Error adding task:", error);
//       // Reset the loading state on error
//       setLists((prevLists) => {
//         const updatedLists = [...prevLists];
//         updatedLists[index].isAdding = false;
//         return updatedLists;
//       });
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
//       const response = await fetch(`/api/boards/${boardId}/lists`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ listName: newListTitle }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Failed to add list: ${errorData.message}`);
//       }

//       const { newList } = await response.json();
//       const formattedNewList = {
//         ...newList,
//         title: newList.listName,
//         tasks: [],
//         addingTask: false,
//       };
//       setLists([...lists, formattedNewList]);
//       setNewListTitle("");
//       setAddingNewList(false);
//     } catch (error) {
//       console.error("Error adding list:", error.message);
//     }
//   };

//   const handleTaskInputChange = (index, value) => {
//     setNewTaskTexts((prev) => ({ ...prev, [index]: value }));
//   };

//   return (
//     <>
//       <Navbar />
//       <BoardContainer>
//         {lists.map((list, index) => (
//           <Column key={list._id || index}>
//             <ColumnTitle>{list.title}</ColumnTitle>

//             {list.tasks?.map((task) => (
//               <TaskCard key={task._id}>{task.text || task.taskName}</TaskCard>
//             ))}

//             {list.addingTask ? (
//               <TaskInputContainer>
//                 <TaskInput
//                   type="text"
//                   placeholder="Enter task..."
//                   value={newTaskTexts[index] || ""}
//                   onChange={(e) => handleTaskInputChange(index, e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleAddTask(index, e.target.value);
//                     }
//                   }}
//                 />
//                 <TaskButtonContainer>
//                   <TaskButton
//                     onClick={() =>
//                       handleAddTask(index, newTaskTexts[index] || "")
//                     }
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
//                   handleAddList();
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

// ----------------------------------------------------

"use client";

import { useState, useEffect } from "react";
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
  TaskCard,
  AddListButton,
} from "./styledCompoonents";
import Navbar from "../Navbar";
import { useParams } from "next/navigation";

const BoardTasks = () => {
  const [lists, setLists] = useState([]);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newTaskTexts, setNewTaskTexts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const boardId = params.board?.toString().trim();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        if (!boardId) {
          console.error("Board ID is missing");
          return;
        }

        const response = await fetch(`/api/boards/${boardId}/lists`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch lists: ${errorData.message}`);
        }

        const data = await response.json();
        const formattedLists = (data.lists || []).map((list) => ({
          ...list,
          title: list.listName,
          tasks: list.tasks || [],
          addingTask: false,
        }));

        setLists(formattedLists);

        for (let i = 0; i < formattedLists.length; i++) {
          fetchTasksForList(formattedLists[i]._id, i);
        }
      } catch (error) {
        console.error("Error fetching lists:", error.message);
      }
    };

    const fetchTasksForList = async (listId, index) => {
      try {
        if (!boardId || !listId) return;

        const response = await fetch(`/api/boards/${boardId}/lists/${listId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch tasks: ${errorData.message}`);
        }

        const { tasks } = await response.json();

        setLists((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index].tasks = tasks;
          return updatedLists;
        });
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

  const handleAddTask = async (index) => {
    const taskText = newTaskTexts[index] || "";
    if (!taskText.trim() || isLoading) return; // Prevent multiple submissions

    const listId = lists[index]._id;
    if (!boardId || !listId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName: taskText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add task: ${errorText}`);
      }

      const data = await response.json();

      // Use functional update to ensure we have the latest state
      setLists((prevLists) => {
        const updatedLists = [...prevLists];
        // Check if task already exists to prevent duplicates
        const taskExists = updatedLists[index].tasks.some(
          (task) => task._id === data.task._id
        );

        if (!taskExists) {
          updatedLists[index].tasks = [...updatedLists[index].tasks, data.task];
        }

        updatedLists[index].addingTask = false;
        return updatedLists;
      });

      // Clear the input field
      setNewTaskTexts((prev) => ({ ...prev, [index]: "" }));
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent form submission or new line
      handleAddTask(index);
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
      const response = await fetch(`/api/boards/${boardId}/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listName: newListTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add list: ${errorData.message}`);
      }

      const { newList } = await response.json();
      const formattedNewList = {
        ...newList,
        title: newList.listName,
        tasks: [],
        addingTask: false,
      };
      setLists([...lists, formattedNewList]);
      setNewListTitle("");
      setAddingNewList(false);
    } catch (error) {
      console.error("Error adding list:", error.message);
    }
  };

  const handleTaskInputChange = (index, value) => {
    setNewTaskTexts((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <>
      <Navbar />
      <BoardContainer>
        {lists.map((list, index) => (
          <Column key={list._id || index}>
            <ColumnTitle>{list.title}</ColumnTitle>

            {list.tasks?.map((task) => (
              <TaskCard key={task._id}>{task.text}</TaskCard>
            ))}

            {list.addingTask ? (
              <TaskInputContainer>
                <TaskInput
                  type="text"
                  placeholder="Enter task..."
                  value={newTaskTexts[index] || ""}
                  onChange={(e) => handleTaskInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={isLoading}
                />
                <TaskButtonContainer>
                  <TaskButton
                    onClick={() => handleAddTask(index)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Task"}
                  </TaskButton>
                  <CancelButton
                    onClick={() => toggleTaskInput(index)}
                    disabled={isLoading}
                  >
                    ✖
                  </CancelButton>
                </TaskButtonContainer>
              </TaskInputContainer>
            ) : (
              <TaskPlaceholder onClick={() => toggleTaskInput(index)}>
                + Add a task
              </TaskPlaceholder>
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
                if (e.key === "Enter") {
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
