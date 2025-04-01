import clientPromise from "../../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("TaskManager");
    const { boards, list } = params;

    const boardObjectId = new ObjectId(boards);
    const listObjectId = new ObjectId(list);

    const boardsCollection = db.collection("boards");
    const boardDoc = await boardsCollection.findOne({
      _id: boardObjectId,
    });

    if (!boardDoc) {
      return new Response(JSON.stringify({ message: "Board not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const targetList = boardDoc.lists.find(
      (listItem) => listItem._id.toString() === list
    );

    if (!targetList) {
      return new Response(JSON.stringify({ message: "List not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        tasks: targetList.taskIds || [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("TaskManager");
    const { boards, list } = params;

    console.log("POST params:", { boards, list });

    const body = await req.json();
    const { taskName } = body;

    console.log("Request body:", body);

    if (!taskName) {
      return new Response(
        JSON.stringify({ message: "Task name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let boardObjectId, listObjectId;
    try {
      boardObjectId = new ObjectId(boards);
      listObjectId = new ObjectId(list);
    } catch (error) {
      console.error("Invalid ObjectId:", error);
      return new Response(
        JSON.stringify({ message: "Invalid Board or List ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newTask = {
      _id: new ObjectId(),
      text: taskName,
      createdAt: new Date(),
    };

    const boardsCollection = db.collection("boards");

    // First check if the board and list exist
    const boardDoc = await boardsCollection.findOne({
      _id: boardObjectId,
    });

    if (!boardDoc) {
      return new Response(JSON.stringify({ message: "Board not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const targetList = boardDoc.lists.find(
      (listItem) => listItem._id.toString() === list
    );

    if (!targetList) {
      return new Response(JSON.stringify({ message: "List not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await boardsCollection.updateOne(
      {
        _id: boardObjectId,
        "lists._id": listObjectId,
      },
      {
        $push: {
          "lists.$.taskIds": newTask,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Failed to update list" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedBoardDoc = await boardsCollection.findOne({
      _id: boardObjectId,
    });

    const updatedList = updatedBoardDoc.lists.find(
      (listItem) => listItem._id.toString() === list
    );

    return new Response(
      JSON.stringify({
        message: "Task added successfully",
        task: newTask,
        updatedList: updatedList,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("TaskManager");

    const { boards, list } = params;
    console.log("Received boardId:", boards, "and listId:", list);

    if (!ObjectId.isValid(boards) || !ObjectId.isValid(list)) {
      return new Response(JSON.stringify({ message: "Invalid ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const board = await db
      .collection("boards")
      .findOne({ _id: new ObjectId(boards) });

    if (!board) {
      return new Response(JSON.stringify({ message: "Board not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updateResult = await db
      .collection("boards")
      .updateOne(
        { _id: new ObjectId(boards) },
        { $pull: { lists: { _id: new ObjectId(list) } } }
      );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Failed to delete list or list not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "List deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting list:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
