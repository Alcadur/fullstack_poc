import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { TaskList } from './task-list';
import { Task } from '@/models/task.model';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IntersectionObserverMock } from '@/utils/test-helpers';
import { TaskListRow } from '@/pages/tasks/components/task-list/task-list-row/task-list-row';

@Component({
  selector: 'task-list-row',
  template: ''
})
class MockTaskListRow {
}

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;

  const mockTasks: Task[] = [
    {
      uuid: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      completed: false,
      authorUuid: 'user1',
      steps: []
    },
    {
      uuid: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      completed: true,
      authorUuid: 'user1',
      steps: []
    },
    {
      uuid: '3',
      title: 'Test Task 3',
      description: 'Description 3',
      completed: false,
      authorUuid: 'user1',
      steps: []
    }
  ];

  async function renderAllDeferBlocks() {
    const deferBlocks = await fixture.getDeferBlocks();
    for (const deferBlock of deferBlocks) {
      await deferBlock.render(DeferBlockState.Complete);
    }
  }

  beforeAll(() => vi.stubGlobal('IntersectionObserver', IntersectionObserverMock));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      deferBlockBehavior: DeferBlockBehavior.Manual,
      imports: [TaskList],
      providers: [
        { provide: TaskListRow, useClass: MockTaskListRow },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should render only visible number of task-list-row components', async () => {
    fixture.componentRef.setInput('tasks', mockTasks);
    fixture.detectChanges();

    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(DeferBlockState.Complete);

    const taskRows = fixture.debugElement.queryAll(By.directive(TaskListRow));
    expect(taskRows).toHaveLength(1);
  });

  it('should pass correct task data to each task-list-row component', () => {
    fixture.componentRef.setInput('tasks', mockTasks);
    fixture.detectChanges();

    const taskRows = fixture.debugElement.queryAll(By.directive(TaskListRow));

    taskRows.forEach((taskRow: DebugElement, index: number) => {
      const taskListRowComponent = taskRow.componentInstance as TaskListRow;
      expect(taskListRowComponent.task()).toEqual(mockTasks[index]);
    });
  });

  it('should render no task-list-row components when tasks array is empty', async () => {
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();
    await renderAllDeferBlocks();

    const taskRows = fixture.debugElement.queryAll(By.directive(TaskListRow));
    expect(taskRows.length).toBe(0);
  });

  it('should update rendered tasks when input changes', async () => {
    fixture.componentRef.setInput('tasks', mockTasks);
    fixture.detectChanges();
    await renderAllDeferBlocks();
    let taskRows = fixture.debugElement.queryAll(By.directive(TaskListRow));
    expect(taskRows.length).toBe(mockTasks.length);

    const updatedTasks: Task[] = [mockTasks[0]];
    fixture.componentRef.setInput('tasks', updatedTasks);
    fixture.detectChanges();

    taskRows = fixture.debugElement.queryAll(By.directive(TaskListRow));
    expect(taskRows.length).toBe(updatedTasks.length);
  });

  it('should track tasks by uuid', async () => {
    fixture.componentRef.setInput('tasks', mockTasks);
    fixture.detectChanges();
    await renderAllDeferBlocks();

    const taskRows = fixture.debugElement.queryAll(By.directive(TaskListRow));
    const firstRowComponent = taskRows[0].componentInstance as TaskListRow;

    expect(firstRowComponent.task().uuid).toBe(mockTasks[0].uuid);
  });

  it('should maintain task order', () => {
    fixture.componentRef.setInput('tasks', mockTasks);
    fixture.detectChanges();

    const taskRows = fixture.debugElement.queryAll(By.directive(TaskListRow));

    taskRows.forEach((taskRow: DebugElement, index: number) => {
      const taskListRowComponent = taskRow.componentInstance as TaskListRow;
      expect(taskListRowComponent.task().uuid).toBe(mockTasks[index].uuid);
    });
  });
});
