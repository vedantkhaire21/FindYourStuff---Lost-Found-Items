import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { BsInstagram, BsTwitterX, BsGithub } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Stack
      width="100%"
      sx={{
        background: 'rgba(11, 16, 32, 0.95)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        mt: 'auto',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
        maxWidth="1440px"
        width="100%"
        alignSelf="center"
        px={{ xs: 3, md: 6 }}
        py={4}
        gap={3}
      >
        {/* Brand */}
        <Stack gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Stack
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(79,124,255,0.3)',
              }}
            >
              🔍
            </Stack>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '16px',
                background: 'linear-gradient(135deg, #4F7CFF, #8B5CF6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FindYourStuff
            </Typography>
          </Stack>
          <Typography sx={{ color: '#475569', fontSize: '13px', maxWidth: '280px' }}>
            Helping communities reconnect people with their lost belongings.
          </Typography>
        </Stack>

        {/* Links */}
        <Stack direction="row" gap={{ xs: 3, md: 6 }}>
          <Stack gap={1.5}>
            <Typography sx={{ color: '#64748B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
              BROWSE
            </Typography>
            {[
              { label: 'Lost Items', to: '/LostItems' },
              { label: 'Found Items', to: '/FoundItems' },
              { label: 'Post Item', to: '/postitem' },
            ].map((l) => (
              <Typography
                key={l.to}
                component={Link}
                to={l.to}
                sx={{
                  color: '#475569',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#94A3B8' },
                }}
              >
                {l.label}
              </Typography>
            ))}
          </Stack>
          <Stack gap={1.5}>
            <Typography sx={{ color: '#64748B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
              ACCOUNT
            </Typography>
            {[
              { label: 'Sign In', to: '/log-in' },
              { label: 'Sign Up', to: '/sign-up' },
              { label: 'My Listings', to: '/mylistings' },
            ].map((l) => (
              <Typography
                key={l.to}
                component={Link}
                to={l.to}
                sx={{
                  color: '#475569',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#94A3B8' },
                }}
              >
                {l.label}
              </Typography>
            ))}
          </Stack>
        </Stack>

        {/* Social icons */}
        <Stack gap={1.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Typography sx={{ color: '#64748B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
            FOLLOW US
          </Typography>
          <Stack direction="row" gap={2}>
            {[
              { Icon: BsInstagram, href: 'https://www.instagram.com/', label: 'Instagram' },
              { Icon: BsTwitterX, href: 'https://x.com/', label: 'X / Twitter' },
              { Icon: BsGithub, href: 'https://github.com/KcMelek/Lost-Found-MERN', label: 'GitHub' },
            ].map(({ Icon, href, label }) => (
              <a
                key={href}
                target="_blank"
                rel="noreferrer"
                href={href}
                aria-label={label}
                style={{ textDecoration: 'none' }}
              >
                <Stack
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(79,124,255,0.12)',
                      border: '1px solid rgba(79,124,255,0.3)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Icon size="16px" color="#94A3B8" />
                </Stack>
              </a>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* Bottom bar */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.04)', py: 2, px: { xs: 3, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          maxWidth="1440px"
          alignSelf="center"
          width="100%"
          gap={1}
        >
          <Typography sx={{ color: '#334155', fontSize: '12px' }}>
            © 2025 FindYourStuff. All rights reserved.
          </Typography>
          <Typography
            component="a"
            href="https://github.com/KcMelek/Lost-Found-MERN"
            target="_blank"
            rel="noreferrer"
            sx={{ color: '#334155', fontSize: '12px', textDecoration: 'none', '&:hover': { color: '#475569' } }}
          >
            Open source on GitHub ↗
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Footer;
