import clientPromise from "../../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    console.log("Params:", params);

    const client = await clientPromise;
    if (!client) {
      console.error("Failed to connect to database");
      return new Response(
        JSON.stringify({ message: "Database connection error" }),
        {
          status: 500,
        }
      );
    }

    const db = client.db("TaskManager");
    const { boards, list } = params;

    let boardObjectId;
    try {
      boardObjectId = new ObjectId(boards);
    } catch (error) {
      console.error("Invalid ObjectId:", error);
      return new Response(JSON.stringify({ message: "Invalid Board ID" }), {
        status: 400,
      });
    }

    const boardsCollection = db.collection("boards");

    const boardDoc = await boardsCollection.findOne({
      _id: boardObjectId,
    });

    if (!boardDoc) {
      console.error("Board not found for ID:", boards);
      return new Response(JSON.stringify({ message: "Board not found" }), {
        status: 404,
      });
    }

    console.log("Board Document:", boardDoc);

    const targetList = boardDoc.lists?.find(
      (listItem) => listItem._id.toString() === list
    );

    if (!targetList) {
      console.error("List not found for ID:", list);
      return new Response(JSON.stringify({ message: "List not found" }), {
        status: 404,
      });
    }

    const tasks = targetList.taskIds.map((task) => ({
      _id: task._id,
      text: task.text,
    }));

    return new Response(
      JSON.stringify({
        tasks: tasks || [],
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("TaskManager");
    const { boards, list } = params;
    const { taskName } = await req.json();

    if (!taskName) {
      return new Response(
        JSON.stringify({ message: "Task name is required" }),
        {
          status: 400,
        }
      );
    }

    const boardObjectId = new ObjectId(boards);
    const listObjectId = new ObjectId(list);

    const boardsCollection = db.collection("boards");

    const boardDoc = await boardsCollection.findOne({
      _id: boardObjectId,
    });

    if (!boardDoc) {
      return new Response(JSON.stringify({ message: "Board not found" }), {
        status: 404,
      });
    }

    const targetList = boardDoc.lists.find(
      (listItem) => listItem._id.toString() === listObjectId.toString()
    );

    if (!targetList) {
      return new Response(JSON.stringify({ message: "List not found" }), {
        status: 404,
      });
    }

    const newTask = {
      _id: new ObjectId(),
      text: taskName,
    };

    targetList.taskIds.push(newTask);

    await boardsCollection.updateOne(
      { _id: boardObjectId, "lists._id": listObjectId },
      { $push: { "lists.$.taskIds": newTask } }
    );

    return new Response(
      JSON.stringify({
        message: "Task added successfully",
        updatedList: targetList,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
