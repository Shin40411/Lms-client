import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { SearchNotFound } from 'src/components/search-not-found';
import { IChatConversation } from 'src/types/chat';
import { AvatarGroup, Badge, ListItemText } from '@mui/material';
import { ConversationItem } from './chat-search-result-item';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: IChatConversation[];
  onClickResult: (id: string) => void;
};

export function ChatNavSearchResults({ query, results, onClickResult }: Props) {
  const totalResults = results.length;

  const notFound = !totalResults && !!query;

  const renderNotFound = () => (
    <SearchNotFound
      query={query}
      sx={{
        p: 3,
        mx: 'auto',
        width: `calc(100% - 40px)`,
        bgcolor: 'background.neutral',
      }}
    />
  );

  const renderResults = () => {
    if (!results || results.length === 0) return null;
    return (
      <nav>
        <Box component="ul" sx={{ '& li': { display: 'flex' } }}>
          {results.map((result) => (
            <li key={result.id}>
              <ConversationItem
                conversationId={result.id}
                onClickResult={onClickResult}
              />
            </li>
          ))}
        </Box>
      </nav>
    );
  };

  return (
    <>
      <Typography variant="h6" sx={{ px: 2.5, mb: 2 }}>
        Cuộc trò chuyện ({totalResults})
      </Typography>

      {notFound ? renderNotFound() : renderResults()}
    </>
  );
}
