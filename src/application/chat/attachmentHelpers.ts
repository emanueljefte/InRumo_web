const ATTACHMENT_PREFIX = '__file__:';

export function formatAttachmentMessage(filePath: string, fileName: string): string {
  return `${ATTACHMENT_PREFIX}${filePath}:${fileName}`;
}

export function parseAttachmentMessage(content: string): { filePath: string; fileName: string } | null {
  if (!content.startsWith(ATTACHMENT_PREFIX)) return null;
  const rest = content.slice(ATTACHMENT_PREFIX.length);
  const [filePath, ...nameParts] = rest.split(':');
  return { filePath, fileName: nameParts.join(':') };
}