import type { IChatConversation, IChatConversations } from 'src/types/chat';

import { useMemo, useState, useEffect, useCallback, startTransition } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { today } from 'src/utils/format-time';

import { createConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext, useMockedUser } from 'src/auth/hooks';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavAccount } from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';
import { initialConversation } from './utils/initial-conversation';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import { StudyGroupItem } from 'src/types/studyGroup';
import { UserItem } from 'src/types/user';
import { UniqueIdentifier } from '@dnd-kit/core';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  selectedConversationId: string;
  collapseNav: UseNavCollapseReturn;
  conversations: IChatConversations;
  groupConversations?: StudyGroupItem[];
};

type GroupSearchResult = { [id: string]: UniqueIdentifier };

export function ChatNav({
  loading,
  collapseNav,
  conversations,
  selectedConversationId,
  groupConversations
}: Props) {
  const router = useRouter();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: IChatConversation[];
  }>({ query: '', results: [] });

  const [fetchedGrDt, setFetchedGrDt] = useState<StudyGroupItem[]>([]);

  const [isGroupSearchResults, setIsGroupSearchResults] = useState<GroupSearchResult>({});

  useEffect(() => {
    if (groupConversations)
      setFetchedGrDt(groupConversations);
  }, [groupConversations]);

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  // const handleClickCompose = useCallback(() => {
  //   if (!mdUp) {
  //     onCloseMobile();
  //   }
  //   router.push(paths.dashboard.chat);
  // }, [mdUp, onCloseMobile, router]);

  const handleSearchContacts = useCallback(
    (inputValue: string) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));
      if (!inputValue) {
        setSearchContacts((prevState) => ({ ...prevState, results: [] }));
        return;
      }

      if (groupConversations) {
        setIsGroupSearchResults(
          Object.fromEntries(groupConversations.map((g) => [g.conversation.id, g.id]))
        );
      }

      const sourceConversations: IChatConversation[] = groupConversations
        ? groupConversations.map((g) => g.conversation)
        : Object.values(conversations.byId);

      const results = sourceConversations.filter((conversation) =>
        conversation.name?.toLowerCase().includes(inputValue.toLowerCase())
      );

      setSearchContacts((prevState) => ({ ...prevState, results }));
    },
    [conversations, groupConversations]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    async (id: any) => {
      handleClickAwaySearch();
      const linkTo = (idConversation: string) => {
        const groupId = isGroupSearchResults[idConversation];
        const targetId = groupId || idConversation;
        startTransition(() => {
          router.push(`${paths.dashboard.chatGroup}?id=${targetId}`);
        });
      };

      try {
        if (conversations.allIds.includes(id)) {
          linkTo(id);
          return;
        }

      } catch (error) {
        console.error('Error handling click result:', error);
      }
    },
    [conversations.allIds, handleClickAwaySearch, isGroupSearchResults]
  );

  const renderLoading = () => <ChatNavItemSkeleton />;

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const lastMessage =
  //       Array.isArray(conversation.messages) && conversation.messages.length > 0
  //         ? conversation.messages[conversation.messages.length - 1]
  //         : undefined;
  //     if (conversation.messages && lastMessage?.senderId !== user?.id) {
  //       try {
  //         const usr = await getUser(lastMessage?.senderId || '');
  //         console.log(usr.lastName);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };
  //   fetchUser();
  // });

  const renderList = () => {
    return (
      fetchedGrDt ? (
        <nav>
          <Box component="ul">
            {fetchedGrDt?.map((g) => (
              <ChatNavItem
                idGroup={g.id}
                key={g.id}
                collapse={collapseDesktop}
                conversationGroup={g.conversation}
                selected={g.conversation.id === selectedConversationId}
                onCloseMobile={onCloseMobile}
                grData={g}
              />
            ))}
          </Box>
        </nav>
      ) : (
        <nav>
          <Box component="ul">
            {conversations.allIds.map((conversationId) => (
              <ChatNavItem
                key={conversationId}
                collapse={collapseDesktop}
                conversationGroup={conversations.byId[conversationId]}
                selected={conversationId === selectedConversationId}
                onCloseMobile={onCloseMobile}
              />
            ))}
          </Box>
        </nav>
      )
    )
  };

  const renderListResults = () => (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = () => (
    <TextField
      fullWidth
      value={searchContacts.query}
      onChange={(event) => handleSearchContacts(event.target.value)}
      placeholder="Tìm kiếm nhóm chat..."
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{ ml: 2.5 }}
    />
  );

  const renderContent = () => (
    <>
      <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {!collapseDesktop && renderSearchInput()}
        <Box sx={{ width: '20%', display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={handleToggleNav}>
            <Iconify
              icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
            />
          </IconButton>
        </Box>
      </Box>

      {/* {!collapseDesktop && (
        <Box
          sx={{
            pt: 2.5,
            px: 2.5,
            pb: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <>
            <ChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
          {!collapseDesktop && (
          <IconButton onClick={handleClickCompose}>
            <Iconify width={24} icon="solar:user-plus-bold" />
          </IconButton>
        )}
        </Box>
      )} */}


      {loading ? (
        renderLoading()
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {searchContacts.query && !!conversations.allIds.length
            ? renderListResults()
            : renderList()
          }
        </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Box
        sx={[
          (theme) => ({
            minHeight: 0,
            flex: '1 1 auto',
            width: NAV_WIDTH,
            flexDirection: 'column',
            display: { xs: 'none', md: 'flex' },
            borderRight: `solid 1px ${theme.vars.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
          }),
        ]}
      >
        {renderContent()}
      </Box>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: NAV_WIDTH } },
        }}
      >
        {renderContent()}
      </Drawer>
    </>
  );
}
