"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryTours } from "@/hooks/useQueryTours";
import { updateTourStatus } from "@/apis/user";
import { CustomModal } from "@/components/CustomModal";
import { CreateTourForm } from "@/components/forms/CreateTourForm";
import { DeleteTourButton } from "@/components/DeleteTourButton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToggle } from "@/hooks/useHook";
import { cn } from "@/lib/utils";
import { ROUTES, USER_ROLE } from "@/utils/constants";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export const ToursAndTasks = () => {
  const router = useRouter();
  const session = useSession();
  const { data: tours, refetch, isLoading, error } = useQueryTours(session.data?.user?.id);
  
  const [isCreateTourModalOpen, toggleCreateTourModal] = useToggle(false);
  const [updateTourId, setUpdateTourId] = useState<number | null>(null);
  const [loadingTourId, setLoadingTourId] = useState<number | null>(null);

  const updateTour = (tourId: number) => {
    if (!tourId) return;
    setUpdateTourId(tourId);
    toggleCreateTourModal();
  };

  const handleUpdateTourStatus = async (tourId: number, value: string) => {
    setLoadingTourId(tourId);
    if (!tourId || !value) return;
    try {
      await updateTourStatus(tourId, value);
      await refetch();
      toast.success("Tour status updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status, please try again.");
    } finally {
      setLoadingTourId(null);
    }
  };

  const viewTourTasks = (tourId: number) => {
    router.push(`${ROUTES.DASHBOARD}/${tourId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load tours. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <>
      <CustomModal
        open={isCreateTourModalOpen}
        closeModal={toggleCreateTourModal}
      >
        <CreateTourForm
          toggleCreateTourModal={toggleCreateTourModal}
          updateTourId={updateTourId}
        />
      </CustomModal>
      
      <div className="flex mt-4 lg:flex-row flex-col lg:justify-between lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Tours</h1>
          <p className="text-sm text-gray-500">Manage your tours and tasks.</p>
        </div>
        {session.data?.user?.role === USER_ROLE.ADMIN && (
          <Button onClick={toggleCreateTourModal} className="cursor-pointer">
            Create Tour
          </Button>
        )}
      </div>

      <div className="mt-6 w-full">
        <div className="border-none shadow-none">
          <div className="!p-0">
            <div className="mt-4 overflow-x-scroll">
              <div className="bg-gray-100 w-max grid gap-x-4 h-14 min-w-[600px] grid-cols-5 items-center rounded-2xl p-2 px-5">
                <small className="text-nowrap w-[200px] text-left">
                  Tour Name
                </small>
                <small className="text-nowrap w-[200px] text-center">
                  Description
                </small>
                <small className="text-nowrap w-[200px] text-center">
                  Date
                </small>
                <small className="text-nowrap w-[200px] text-center">
                  Status
                </small>
                <small className="text-nowrap w-[200px] text-right">
                  Actions
                </small>
              </div>
              
              {tours && tours.length > 0 ? (
                <div className="w-max min-w-[600px] mt-5 px-2">
                  {tours.map((tour, index) => (
                    <div
                      key={tour.id}
                      className={cn(
                        "grid gap-x-4 my-3 grid-cols-5 rounded-md px-2 py-4",
                        {
                          "bg-gray-100": index % 2 !== 0,
                        }
                      )}
                    >
                      <div className="flex flex-col w-[200px] items-start justify-center">
                        <small className="text-nowrap text-left">
                          {tour.name}
                        </small>
                      </div>
                      <div className="flex flex-col w-[200px] items-center justify-center">
                        <small className="text-center">
                          {tour.description || "-"}
                        </small>
                      </div>
                      <div className="flex flex-col w-[200px] items-center justify-center">
                        <small className="text-center">
                          {tour.date ? new Date(tour.date).toLocaleDateString() : "-"}
                        </small>
                      </div>
                      <div className="flex flex-col w-[200px] items-center justify-center">
                        {loadingTourId === tour.id ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <>
                            {session.data?.user?.role === USER_ROLE.ADMIN ? (
                              <Select
                                value={tour.status}
                                onValueChange={(value: string) =>
                                  handleUpdateTourStatus(tour.id, value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder="Set Status"
                                    defaultValue={tour.status}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <small className="text-nowrap text-center">
                                {tour.status}
                              </small>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-row items-center gap-x-2 w-[200px] justify-end">
                        <Button
                          onClick={() => viewTourTasks(tour.id)}
                          variant="ghost"
                          className="cursor-pointer"
                          title="View Tasks"
                        >
                          <IconEye size={16} />
                        </Button>
                        {session.data?.user?.role === USER_ROLE.ADMIN && (
                          <>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTour(tour.id);
                              }}
                              variant="ghost"
                              className="cursor-pointer"
                              title="Edit Tour"
                            >
                              <IconEdit size={16} />
                            </Button>
                            <DeleteTourButton tourId={tour.id} />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <small className="mt-7 inline-block w-full text-center text-sm">
                  No tours available
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};