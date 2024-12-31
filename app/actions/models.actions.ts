// app/actions/models.actions.ts
import { auth } from "@/auth";
import { prisma } from "@/utils/prisma";
import { ModelList } from "@/types/models";

export async function fetchModels(): Promise<ModelList> {
  const user = await auth();
  if (!user?.user?.id) {
    return { data: [], error: "User not authenticated" };
  }

  try {
    const models = await prisma.training.findMany({
      where: {
        user_id: user.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedModels = models.map((model) => ({
      ...model,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
      training_steps: model.training_steps ?? null,
      training_id: model.training_id ?? null,
      training_time: model.training_time
        ? parseFloat(model.training_time)
        : null, // Convert string to number
    }));

    return { data: serializedModels };
  } catch (error) {
    console.error("Error fetching models:", error);
    return { data: [], error };
  }
}
