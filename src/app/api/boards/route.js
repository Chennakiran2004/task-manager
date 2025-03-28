import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("TaskManager");
    const boards = await db
      .collection("boards")
      .find({}, { projection: { _id: 1, title: 1 } })
      .toArray();
    return Response.json(boards, { status: 200 });
  } catch (error) {
    console.error("Error fetching boards:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== "string") {
      return Response.json({ message: "Invalid board title" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("TaskManager");

    const newBoard = {
      title,
      lists: [
        { listName: "To Do", taskIds: [] },
        { listName: "Doing", taskIds: [] },
        { listName: "Done", taskIds: [] },
      ],
    };

    const result = await db.collection("boards").insertOne(newBoard);

    return Response.json(
      { _id: result.insertedId, ...newBoard },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
