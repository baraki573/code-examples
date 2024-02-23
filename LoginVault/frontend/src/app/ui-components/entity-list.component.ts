import { Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { combineLatestWith, map, Observable } from "rxjs";
import { LoginVaultEntity } from "../shared/models/login-vault-entity";
import { EditedEntityService } from "../shared/services/edited-entity.service";

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {

  editedEntityService = inject(EditedEntityService);

  @Input()
  entities$!: Observable<LoginVaultEntity[] | null>;

  @Input()
  elementTemplate!: TemplateRef<LoginVaultEntity>;

  @Input()
  emptyText: string = "Einträge";

  ngOnInit() {
    this.entities$ = this.entities$.pipe(
      combineLatestWith(this.editedEntityService.editedEntity),
      map(([entities, editedEntity]) => {
        if (!editedEntity || !entities) return entities;
        const editedId = editedEntity.id;

        const editedIndex = entities.findIndex(e => e.id === editedId);
        if (editedIndex !== -1) { // Edited Entity is already part of the array (edit)
          const updatedEntity = {...entities[editedIndex], ...editedEntity};
          entities = [...entities.slice(0, editedIndex), updatedEntity, ...entities.slice(editedIndex + 1)];
        }
        else if (editedId === 0) // Edited Entity is not part of the array (create)
          entities = [editedEntity, ...entities];

        // Add the edit-status and return
        return entities.map(entity => ({...entity, isEdited: entity.id === editedId}));
      }),
      map(entities => entities && entities.length > 0 ? entities : null)
    );
  }

  trackBy(index: number, entity: LoginVaultEntity) {
    return entity.id;
  }

}
