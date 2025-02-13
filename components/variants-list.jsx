"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Clipboard } from "lucide-react";
import { VariantDialog } from "./variant-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableBadge = ({ piece, isActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: piece.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <Badge
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      variant={isActive ? "success" : ""}
    >
      {piece.name}
    </Badge>
  );
};

export function VariantsList({ variants, pieces, onUpdate, generateSku }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    editingVariant: null,
  });
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event, variantId) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const variant = variants.find((v) => v.id === variantId);
      const oldIndex = variant.pieceIds.indexOf(active.id);
      const newIndex = variant.pieceIds.indexOf(over.id);

      const newPieceIds = arrayMove(variant.pieceIds, oldIndex, newIndex);
      const updatedVariants = variants.map((v) =>
        v.id === variantId ? { ...v, pieceIds: newPieceIds } : v
      );

      onUpdate(updatedVariants);

      toast({
        title: "Order updated",
        description: "The piece order has been updated successfully.",
      });
    }
  };

  const handleAddVariant = (name, selectedPieceIds) => {
    const newVariant = {
      id: nanoid(),
      name,
      pieceIds: selectedPieceIds,
    };
    onUpdate([...variants, newVariant]);
    toast({
      title: "The variant was created",
      description: `${name} has been successfully created.`,
    });
  };

  const handleEditVariant = (id, name, selectedPieceIds) => {
    onUpdate(
      variants.map((variant) =>
        variant.id === id
          ? { ...variant, name, pieceIds: selectedPieceIds }
          : variant
      )
    );
    toast({
      title: "The variant was updated",
      description: `${name} has been successfully updated.`,
    });
  };

  const handleDeleteVariant = (variantId) => {
    onUpdate(variants.filter((v) => v.id !== variantId));
    toast({
      title: "The variant was deleted",
      description: "Variant has been successfully deleted.",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "SKU copied to clipboard.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-light">Variantlar</CardTitle>
          <Button
            variant="outline"
            onClick={() =>
              setDialogState({ isOpen: true, editingVariant: null })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.map((variant) => {
          const sku = generateSku(variant);
          return (
            <div key={variant.id} className="p-3 border rounded-lg">
              <h4 className="font-medium">{variant.name}</h4>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div className="flex-1">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, variant.id)}
                  >
                    <SortableContext
                      items={variant.pieceIds}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="flex flex-wrap gap-2 mt-2">
                        {variant.pieceIds.map((pieceId) => {
                          const piece = pieces.find((p) => p.id === pieceId);
                          return piece ? (
                            <SortableBadge
                              key={piece.id}
                              piece={piece}
                              isActive={piece.isActive}
                            />
                          ) : null;
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="flex items-center gap-1">
                  <div className="px-4 py-2 bg-muted rounded text-sm font-mono">
                    {sku}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(sku)}
                    title="Copy SKU"
                    className="shrink-0"
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setDialogState({
                        isOpen: true,
                        editingVariant: variant,
                      })
                    }
                    title="Edit Variant"
                    className="shrink-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteVariant(variant.id)}
                    title="Delete Variant"
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {variants?.length === 0 && (
          <div className="text-center text-sm">
            No variants for this product
          </div>
        )}
      </CardContent>

      <VariantDialog
        open={dialogState.isOpen}
        onOpenChange={(isOpen) =>
          setDialogState({ isOpen, editingVariant: null })
        }
        onSubmit={
          dialogState.editingVariant
            ? (name, pieceIds) =>
                handleEditVariant(dialogState.editingVariant.id, name, pieceIds)
            : handleAddVariant
        }
        availablePieces={pieces.filter((p) => p.isActive)}
        editingVariant={dialogState.editingVariant}
      />
    </Card>
  );
}
