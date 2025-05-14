-- Add ai_name column to chat_messages table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS ai_name TEXT;

-- Comment on the ai_name column
COMMENT ON COLUMN chat_messages.ai_name IS 'Name of the AI provider that generated this message'; 