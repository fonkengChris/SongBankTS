// Utility functions for handling mentions in comments

export interface Mention {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

// Extract mentions from text (format: @username)
export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
};

// Replace mentions with highlighted text
export const highlightMentions = (text: string, mentions: Mention[]): string => {
  let highlightedText = text;

  mentions.forEach((mention) => {
    const regex = new RegExp(`@${mention.name}`, 'gi');
    highlightedText = highlightedText.replace(regex, `<span class="mention">@${mention.name}</span>`);
  });

  return highlightedText;
};

// Parse comment text to find and validate mentions
export const parseCommentText = (text: string): {
  cleanText: string;
  mentionUsernames: string[];
} => {
  const mentionRegex = /@(\w+)/g;
  const mentionUsernames: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentionUsernames.push(match[1]);
  }

  return {
    cleanText: text,
    mentionUsernames,
  };
};

// Convert usernames to user IDs (this would typically call an API)
export const resolveMentions = async (usernames: string[]): Promise<string[]> => {
  // This is a placeholder - in a real implementation, you'd call an API
  // to resolve usernames to user IDs
  return usernames.map(username => `user_${username}_id`);
}; 