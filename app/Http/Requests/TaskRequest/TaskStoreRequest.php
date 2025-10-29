<?php

namespace App\Http\Requests\TaskRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'title' => [
                'required',
                Rule::unique('tasks')->where(fn($query) => $query->where('project_id', $this->project_id))
            ],
            'priority_id' => ['required', 'exists:priorities,id'],
            'status_id' => ['required', 'exists:statuses,id'],
            'project_id' => ['required', 'exists:projects,id'],
            'due_date' => ['required'],
            'assignees' => ['array', 'required'],
            'assignees.*' => ['exists:users,id'],
            'subTasks' => ['array'],
            'subTasks.*.title' => ['required_with:subTasks', 'string'],
            'subTasks.*.description' => ['string'],
            'subTasks.*.priority_id' => ['required_with:subTasks', 'exists:priorities,id'],
            'subTasks.*.status_id' => ['required_with:subTasks', 'exists:statuses,id'],
            'subTasks.*.due_date' => ['date'],
            'subTasks.*.assignees' => ['array'],
            'subTasks.*.assignees.*' => ['exists:users,id'],
            'attachment' => ['array'],
            'attachment.*' => ['file', 'mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx,ppt,pptx', 'max:2048']
        ];
    }
}
