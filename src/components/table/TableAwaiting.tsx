import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import * as React from 'react';

import { getTrueColor } from '@/lib/helper';
import { TABLELABELS } from '@/lib/helper';

import { EditorPlanner } from '@/components/modal/EditorPlanner';
import { Planner } from '@/components/modal/Planner';
import Skeleton from '@/components/Skeleton';
import * as DropDownIcon from '@/components/table/dropDown';

import View from './View';
import { IEventProps, IProject } from '../../../types';

import MenuButtonSVG from '~/svg/MenuButtonSVG.svg';

const TableAwaiting = (props: IEventProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = React.useState<boolean>(false);
  const [awaiting, setAwaiting] = React.useState<IProject[]>();

  const [editEntry, setEditEntry] = React.useState({
    _id: 0,
    status: '',
    counselor: '',
    client: '',
    counselingDate: '',
    timeNoteSubmitted: '',
    state: '',
    billed: '',
    notes: '',
  });

  React.useEffect(() => {
    setAwaiting(
      props.eventValues?.filter((e) => e.status == 'awaiting intakes')
    );
  }, [props.eventValues]);

  function closeModal() {
    if (!isEditorOpen) {
      setIsOpen(false);
    } else {
      setIsEditorOpen(false);
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function openEditorModal() {
    setIsEditorOpen(true);
  }

  const router = useRouter();

  const handleRemove = async (client: IProject) => {
    const response = await fetch('/api/dailyEvents/', {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });
    router.reload();
    return response.json();
  };

  const handleEdit = async (event: IProject) => {
    setEditEntry(event);
    openEditorModal();
  };

  return (
    <div className='max-w-[100vw]'>
      <div className='bg-white py-4 px-4 md:py-7 md:px-8 xl:px-10'>
        <h2 className='my-5 rounded-lg bg-indigo-100 p-2 text-indigo-500'>
          Leads
        </h2>
        <div className='flex flex-col items-start'>
          <Planner
            isOpen={isOpen}
            closeModal={closeModal}
            openModal={openModal}
          />
          <EditorPlanner
            isEditorOpen={isEditorOpen}
            closeModal={closeModal}
            editEntry={editEntry}
          />
          <div></div>
        </div>
        <div className='mt-7 h-[500px] overflow-y-scroll scrollbar-thin scrollbar-track-indigo-300 scrollbar-thumb-indigo-700'>
          <table className='w-full whitespace-nowrap rounded-lg border-[1.2px] border-gray-200'>
            <tbody>
              {!awaiting ? (
                <Skeleton className='h-[500px] w-[100%] cursor-wait' />
              ) : (
                <>
                  <tr>
                    {TABLELABELS.map((label, index) => (
                      <td
                        key={index}
                        className='mx-6 border border-gray-100 bg-indigo-200 pl-5 text-left'
                      >
                        {label}
                      </td>
                    ))}
                  </tr>
                  {awaiting?.map((event: IProject) => (
                    <tr
                      key={event._id}
                      tabIndex={0}
                      className='h-16 rounded border border-gray-200 focus:outline-none'
                    >
                      <td
                        className={clsx(
                          getTrueColor(event.status),
                          'px-4 text-xs font-medium uppercase leading-none md:text-sm'
                        )}
                      >
                        <div className='flex items-center'>
                          <p>{event.status}</p>
                        </div>
                      </td>
                      <td className='px-4 font-medium uppercase leading-none text-gray-700'>
                        <div className='flex items-center'>
                          <p className='ml-2 text-xs leading-none text-gray-600 md:text-sm'>
                            {event.counselor}
                          </p>
                        </div>
                      </td>
                      <td className='px-4 font-medium uppercase leading-none text-gray-700'>
                        <div className='flex items-center'>
                          <p className='ml-2 text-xs leading-none text-gray-600 md:text-sm'>
                            {event.client}
                          </p>
                        </div>
                      </td>
                      <td className='px-4 font-medium uppercase leading-none text-gray-700'>
                        <div className='flex items-center'>
                          <p className='ml-2 text-xs leading-none text-gray-600 md:text-sm'>
                            {event.counselingDate} @ {event.timeNoteSubmitted}
                          </p>
                        </div>
                      </td>
                      <td className='px-4 font-medium uppercase leading-none text-gray-700'>
                        <div className='flex items-center'>
                          <p className='ml-2 text-xs leading-none text-gray-600 md:text-sm'>
                            {event.state}
                          </p>
                        </div>
                      </td>
                      <td className='px-4 font-medium uppercase leading-none text-gray-700'>
                        <div className='flex items-center'>
                          {event.billed == 'yes' ? (
                            <p className='rounded bg-green-100 py-3 px-3 text-sm leading-none text-green-700 focus:outline-none'>
                              {event.billed}
                            </p>
                          ) : (
                            <p className='rounded bg-red-100 py-3 px-3 text-sm leading-none text-red-700 focus:outline-none'>
                              {event.billed}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className='px-4 font-medium uppercase leading-none text-gray-700'>
                        <View>{event.notes}</View>
                      </td>
                      <td>
                        <div>
                          <Menu
                            as='div'
                            className='relative inline-block text-left'
                          >
                            <div>
                              <Menu.Button className='rounded bg-gray-100 py-3 px-5 text-sm leading-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 hover:bg-gray-200'>
                                <MenuButtonSVG />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={React.Fragment}
                              enter='transition ease-out duration-100'
                              enterFrom='transform opacity-0 scale-95'
                              enterTo='transform opacity-100 scale-100'
                              leave='transition ease-in duration-75'
                              leaveFrom='transform opacity-100 scale-100'
                              leaveTo='transform opacity-0 scale-95'
                            >
                              <Menu.Items className='absolute right-0 top-10 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                <div className='px-1 py-1'>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => handleRemove(event)}
                                        className={`${
                                          active
                                            ? 'bg-indigo-500 text-white'
                                            : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      >
                                        {active ? (
                                          <DropDownIcon.DeleteActiveIcon
                                            className='mr-2 h-5 w-5 text-indigo-400'
                                            aria-hidden='true'
                                          />
                                        ) : (
                                          <DropDownIcon.DeleteInactiveIcon
                                            className='mr-2 h-5 w-5 text-indigo-400'
                                            aria-hidden='true'
                                          />
                                        )}
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                                <div className='px-1 py-1 '>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => handleEdit(event)}
                                        className={`${
                                          active
                                            ? 'bg-indigo-500 text-white'
                                            : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      >
                                        {active ? (
                                          <DropDownIcon.EditActiveIcon
                                            className='mr-2 h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        ) : (
                                          <DropDownIcon.EditInactiveIcon
                                            className='mr-2 h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        )}
                                        Edit
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                                <div className='px-1 py-1'>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => {
                                          alert('NOT YET AVAILABLE');
                                        }}
                                        className={`${
                                          active
                                            ? 'bg-indigo-500 text-white'
                                            : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      >
                                        {active ? (
                                          <DropDownIcon.ArchiveActiveIcon
                                            className='mr-2 h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        ) : (
                                          <DropDownIcon.ArchiveInactiveIcon
                                            className='mr-2 h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        )}
                                        Archive
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableAwaiting;