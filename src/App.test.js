import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { LOAD_ERROR_PLACEHOLDER } from './player/playerReducer';

function simulatePlaying() {
  act(() => {
    document.querySelector('audio').dispatchEvent(new Event('playing'));
  });
}

test('renders the playlist shell with the first track paused', () => {
  render(<App />);

  expect(screen.getByText('Playlist (8)')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ridge Line');
  expect(screen.getByText('Now Playing')).toBeInTheDocument();
  expect(screen.getByLabelText('Play')).toBeInTheDocument();
  expect(screen.getByLabelText('Previous')).toBeDisabled();
  expect(screen.queryByLabelText(/shuffle/i)).not.toBeInTheDocument();
  expect(document.querySelector('audio')).toBeInTheDocument();
});

test('clicking another row buffers then plays; current row toggles; ends stay disabled', async () => {
  render(<App />);

  await userEvent.click(screen.getByRole('button', { name: /salt air/i }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Salt Air');
  expect(screen.getByRole('button', { name: /salt air/i })).toHaveAttribute(
    'aria-current',
    'true'
  );
  expect(screen.getByLabelText('Buffering')).toBeInTheDocument();

  simulatePlaying();
  expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  expect(screen.getByLabelText('Previous')).not.toBeDisabled();

  await userEvent.click(screen.getByRole('button', { name: /salt air/i }));
  expect(screen.getByLabelText('Play')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Salt Air');

  await userEvent.click(screen.getByLabelText('Previous'));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Night Grid');
  expect(screen.getByLabelText('Buffering')).toBeInTheDocument();
  simulatePlaying();
  expect(screen.getByLabelText('Pause')).toBeInTheDocument();

  await userEvent.click(screen.getByLabelText('Previous'));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ridge Line');
  expect(screen.getByLabelText('Previous')).toBeDisabled();
  simulatePlaying();
  expect(screen.getByLabelText('Pause')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /northern window/i }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Northern Window'
  );
  expect(screen.getByLabelText('Next')).toBeDisabled();
  expect(screen.getByLabelText('Buffering')).toBeInTheDocument();
});

test('waiting while playing shows buffering again', async () => {
  render(<App />);
  await userEvent.click(screen.getByLabelText('Play'));
  expect(screen.getByLabelText('Buffering')).toBeInTheDocument();

  simulatePlaying();
  expect(screen.getByLabelText('Pause')).toBeInTheDocument();

  act(() => {
    document.querySelector('audio').dispatchEvent(new Event('waiting'));
  });
  expect(screen.getByLabelText('Buffering')).toBeInTheDocument();

  simulatePlaying();
  expect(screen.getByLabelText('Pause')).toBeInTheDocument();
});

test('ended resets the current track to 0:00 paused', () => {
  render(<App />);
  act(() => {
    document.querySelector('audio').dispatchEvent(new Event('ended'));
  });

  expect(screen.getByLabelText('Play')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ridge Line');
  expect(screen.getAllByText('0:00').length).toBeGreaterThan(0);
});

test('load error stays on the track and clears after selecting another', async () => {
  render(<App />);
  act(() => {
    document.querySelector('audio').dispatchEvent(new Event('error'));
  });

  expect(screen.getByText(LOAD_ERROR_PLACEHOLDER)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ridge Line');

  await userEvent.click(screen.getByRole('button', { name: /salt air/i }));
  expect(screen.queryByText(LOAD_ERROR_PLACEHOLDER)).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Salt Air');
  expect(screen.getByLabelText('Buffering')).toBeInTheDocument();
});

test('speaker is not a mute control', async () => {
  render(<App />);
  expect(screen.queryByLabelText(/mute/i)).not.toBeInTheDocument();
  expect(screen.getByLabelText('Volume')).toBeInTheDocument();
});
