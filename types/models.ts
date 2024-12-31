// types/models.ts
export type ModelType = {
    id: string;
    user_id: string | null;
    model_name: string | null;
    model_id: string | null;
    training_status: string | null;
    zipUrl: string | null;
    trigger_word: string | null;
    training_steps: number | null; // Allow null for compatibility
    training_time: number | null;
    training_id: string | null; // Allow null if applicable
    createdAt: string; // Serialized to ISO string
    updatedAt: string;
  };
  
  export type ModelList = {
    data: ModelType[];
    error?: any;
  };
  